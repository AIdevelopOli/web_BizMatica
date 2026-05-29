export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Skip API routes
  if (url.pathname.startsWith('/api/')) {
    return next();
  }

  const langPrefix = {
    'bizmatica.cz':     '/cs',
    'www.bizmatica.cz': '/cs',
    'bizmatica.sk':     '/sk',
    'www.bizmatica.sk': '/sk',
  }[hostname];

  if (langPrefix && url.pathname === '/') {
    const newUrl = new URL(url);
    newUrl.pathname = langPrefix + '/';
    return next(new Request(newUrl.toString(), request));
  }

  return next();
}
