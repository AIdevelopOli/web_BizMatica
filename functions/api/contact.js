export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { name, email, company, message, lang, 'cf-turnstile-response': token } = await request.json();

    const fromMap = {
      cs: 'BizMatica Web <info@bizmatica.cz>',
      sk: 'BizMatica Web <info@bizmatica.sk>',
      en: 'BizMatica Web <info@bizmatica.net>',
    };
    const from = fromMap[lang] || fromMap.en;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify Turnstile token
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
    });
    const verifyData = await verify.json();
    if (!verifyData.success) {
      return new Response(JSON.stringify({ error: 'Spam check failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: 'info@bestbiz.cz',
        reply_to: email,
        subject: `New inquiry from ${name}${company ? ` (${company})` : ''}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          <hr/>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
