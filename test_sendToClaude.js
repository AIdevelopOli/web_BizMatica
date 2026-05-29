const handler = require('./api/sendToClaude');

process.env.MOCK_CLAUDE = '1';

const req = {
  method: 'POST',
  body: { text: 'Ahoj Claude, jak se máš?', lang: 'cs-CZ' }
};

const res = {
  _status: 200,
  status(code) { this._status = code; return this; },
  json(obj) { console.log('RESPONSE STATUS:', this._status); console.log(JSON.stringify(obj, null, 2)); }
};

handler(req, res).catch(err => { console.error('Handler error:', err); process.exit(1); });
