import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== Step 1: Building project ===');
const buildRes = spawnSync('npm', ['run', 'build:cf'], { stdio: 'inherit', shell: true });
if (buildRes.status !== 0) {
  console.error('Build failed!');
  process.exit(buildRes.status ?? 1);
}

console.log('=== Step 2: Applying manifest and route patches ===');
const manifestPath = path.resolve('dist/server/__vite_rsc_assets_manifest.js');
const clientAssetsPath = path.resolve('dist/server/vinext-client-assets.js');
const indexPath = path.resolve('dist/server/index.js');
const wranglerPath = path.resolve('dist/server/wrangler.json');

if (fs.existsSync(manifestPath)) {
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  fs.writeFileSync(clientAssetsPath, manifest, 'utf8');
  console.log('Copied manifest to vinext-client-assets.js');
} else {
  console.error('Manifest file missing:', manifestPath);
  process.exit(1);
}

if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  indexContent = indexContent.replace(/["']__vite_rsc_assets_manifest\.js["']/g, '"./vinext-client-assets.js"');
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Patched index.js imports');
}

if (fs.existsSync(wranglerPath)) {
  const wranglerConfig = JSON.parse(fs.readFileSync(wranglerPath, 'utf8'));
  wranglerConfig.routes = [
    { pattern: 'mythralab.com', custom_domain: true },
    { pattern: 'www.mythralab.com', custom_domain: true }
  ];

  // Inject .env variables into wrangler vars so Cloudflare Worker runtime has access
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        envVars[key] = val;
      }
    }
    wranglerConfig.vars = {
      ...(wranglerConfig.vars || {}),
      ...envVars,
    };
    console.log('Injected environment variables into Cloudflare Worker vars:', Object.keys(envVars));
  }

  fs.writeFileSync(wranglerPath, JSON.stringify(wranglerConfig, null, 2), 'utf8');
  console.log('Configured custom domains and vars in wrangler.json');
}

console.log('=== Step 3: Deploying to Cloudflare Worker ===');
const deployRes = spawnSync('npx', ['wrangler', 'deploy', '--config', 'dist/server/wrangler.json'], { stdio: 'inherit', shell: true });
if (deployRes.status !== 0) {
  console.error('Deployment failed!');
  process.exit(deployRes.status ?? 1);
}

console.log('=== Deployment Completed Successfully! ===');
