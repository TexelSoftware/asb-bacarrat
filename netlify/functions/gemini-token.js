import { GoogleGenAI } from '@google/genai';

// Mints a short-lived ephemeral auth token for the Gemini Live API.
// The real GEMINI_API_KEY stays server-side in the Netlify env var.
export default async (req) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY env var not set' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Token valid 30 min; session must start within 2 min of creation.
    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(Date.now() + 2 * 60 * 1000).toISOString();
    const token = await ai.authTokens.create({
      config: { uses: 1, expireTime, newSessionExpireTime },
    });
    return new Response(
      JSON.stringify({ token: token.name }),
      {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-store',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};

export const config = { path: '/api/gemini-token' };
