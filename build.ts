// Build script for static GitHub Pages deployment
import { write } from 'bun';

// Build the React app
const result = await Bun.build({
  entrypoints: ['./src/client.tsx'],
  outdir: './dist',
  minify: true,
});

if (!result.success) {
  console.error('Build failed:', result.logs);
  process.exit(1);
}

// Create static index.html
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pool Scoreboard</title>
  <link rel="stylesheet" href="./client.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./client.js"></script>
</body>
</html>`;

await write('./dist/index.html', html);

console.log('✅ Build complete! Files generated in ./dist/');
