// Mints a short-lived ephemeral auth token for the Gemini Live API.
// The real GEMINI_API_KEY stays server-side in the Netlify env var.
export default async (req) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: 'GEMINI_API_KEY env var not set' }, 500);
  }

  const now = Date.now();
  const body = {
    config: {
      uses: 1,
      expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
      newSessionExpireTime: new Date(now + 2 * 60 * 1000).toISOString(),
    },
  };

  const endpoint =
    `https://generativelanguage.googleapis.com/v1alpha/authTokens?key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      return json({ error: `upstream ${res.status}`, detail: text }, 502);
    }
    const data = JSON.parse(text);
    // Response contains { name: "authTokens/abc123..." } — browser uses that string as apiKey.
    const token = data.name || data.token;
    if (!token) return json({ error: 'no token in response', detail: text }, 502);
    return json({ token });
  } catch (err) {
    return json({ error: String(err?.message || err) }, 500);
  }
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export const config = { path: '/api/gemini-token' };
