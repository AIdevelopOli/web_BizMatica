const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, message, link, type, lang } = req.body;

  const to = lang === 'sk' ? 'info@bizmatica.sk' : lang === 'en' ? 'info@bizmatica.net' : 'info@bizmatica.cz';
  const isCareer = type === 'kariera';
  const safeLink = typeof link === 'string' && /^https?:\/\//i.test(link.trim())
    ? link.trim().replace(/[<>"]/g, '')
    : '';

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.email.cz',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"BizMatica Web" <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: isCareer
        ? `Uchazeč o spolupráci: ${name}`
        : `New inquiry from ${name}${company ? ` (${company})` : ''}`,
      text: isCareer
        ? `Uchazeč o spolupráci\nJméno: ${name}\nE-mail: ${email}\n${safeLink ? `Odkaz na práci: ${safeLink}\n` : ''}\nZpráva:\n${message}`
        : `Name: ${name}\nEmail: ${email}\n${company ? `Company: ${company}\n` : ''}\nMessage:\n${message}`,
      html: isCareer
        ? `
        <p><strong>Uchazeč o spolupráci</strong></p>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
        ${safeLink ? `<p><strong>Odkaz na práci:</strong> <a href="${safeLink}">${safeLink}</a></p>` : ''}
        <hr/>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
        : `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <hr/>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
