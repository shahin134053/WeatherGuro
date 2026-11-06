import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import https from 'https';
import { defineConfig, Plugin } from 'vite';

const ttsProxyPlugin = (): Plugin => ({
  name: 'tts-proxy-plugin',
  configureServer(server) {
    server.middlewares.use('/api/tts', (req, res) => {
      try {
        const urlObj = new URL(req.url || '', 'http://localhost');
        const tl = urlObj.searchParams.get('tl') || 'bn';
        const q = urlObj.searchParams.get('q') || '';
        if (!q.trim()) {
          res.statusCode = 400;
          return res.end('Missing text query');
        }
        const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(tl)}&client=tw-ob&q=${encodeURIComponent(q.trim())}`;
        const upstream = https.get(
          targetUrl,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          },
          (upstreamRes) => {
            res.writeHead(upstreamRes.statusCode || 200, {
              'Content-Type': upstreamRes.headers['content-type'] || 'audio/mpeg',
              'Cache-Control': 'public, max-age=86400',
              'Access-Control-Allow-Origin': '*'
            });
            upstreamRes.pipe(res);
          }
        );
        upstream.on('error', (err) => {
          res.statusCode = 502;
          res.end(err.message);
        });
      } catch (err: any) {
        res.statusCode = 500;
        res.end(err?.message || 'Server error');
      }
    });
  }
});

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), ttsProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
