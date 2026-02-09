import { promises as fs } from 'node:fs';
import path from 'node:path';

const srcRoot = path.resolve('src');
const distRoot = path.resolve('dist');

async function copyCss(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await copyCss(srcPath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.css')) {
      continue;
    }

    const relPath = path.relative(srcRoot, srcPath);
    const destPath = path.join(distRoot, relPath);
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(srcPath, destPath);
  }
}

await copyCss(srcRoot);
