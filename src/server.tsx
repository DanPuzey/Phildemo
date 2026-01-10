const HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pool Scoreboard</title>
  <link rel="stylesheet" href="/client.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/client.js"></script>
</body>
</html>
`;

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/') {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (url.pathname === '/client.js') {
      const isDev = process.env.NODE_ENV !== 'production';

      if (isDev) {
        // Development: build on-the-fly
        const result = await Bun.build({
          entrypoints: ['./src/client.tsx'],
          outdir: './dist',
        });

        if (result.success) {
          const file = Bun.file('./dist/client.js');
          return new Response(file, {
            headers: { 'Content-Type': 'application/javascript' },
          });
        }
      } else {
        // Production: serve pre-built file
        const file = Bun.file('./dist/client.js');
        return new Response(file, {
          headers: { 'Content-Type': 'application/javascript' },
        });
      }
    }

    if (url.pathname === '/client.css') {
      const file = Bun.file('./dist/client.css');
      return new Response(file, {
        headers: { 'Content-Type': 'text/css' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`🎱 Pool Scoreboard running at http://localhost:${server.port}`);
