// Returns the raw GEMINI_API_KEY from the Netlify env var.
// The browser uses it directly to open a Live WebSocket.
// Tradeoff vs ephemeral tokens: the key is exposed to any client that hits
// this endpoint, so the function is effectively a public key handout.
// Acceptable for the prototype; rotate + switch back to ephemeral tokens
// before wider release.
export default async (req) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY env var not set' }), {
      status: 500,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
  return new Response(JSON.stringify({ token: apiKey }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};

export const config = { path: '/api/gemini-token' };
