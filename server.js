import express from 'express';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// High-reliability server-side TTS proxy route (for Bengali & international voice bulletins)
app.get('/api/tts', (req, res) => {
  try {
    const tl = String(req.query.tl || 'bn');
    const q = String(req.query.q || '');

    if (!q.trim()) {
      res.status(400).send('Missing text query');
      return;
    }

    const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
      tl
    )}&client=tw-ob&q=${encodeURIComponent(q.trim())}`;

    const upstream = https.get(
      targetUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
      (upstreamRes) => {
        res.writeHead(upstreamRes.statusCode || 200, {
          'Content-Type': upstreamRes.headers['content-type'] || 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        });
        upstreamRes.pipe(res);
      }
    );

    upstream.on('error', (err) => {
      res.status(502).send(err.message);
    });
  } catch (err) {
    res.status(500).send('TTS proxy error');
  }
});

// Serve static production build from dist/
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback for all client-side routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`WeatherGuru Gold server running on port ${PORT}`);
});
