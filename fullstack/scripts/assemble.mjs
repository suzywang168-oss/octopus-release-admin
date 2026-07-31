import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function assemble(sourceDirectory, destinationFile) {
  const names = (await readdir(sourceDirectory))
    .filter((name) => name.endsWith('.txt'))
    .sort();
  if (!names.length) throw new Error(`No source parts found in ${sourceDirectory}`);
  const parts = await Promise.all(names.map((name) => readFile(path.join(sourceDirectory, name), 'utf8')));
  await mkdir(path.dirname(destinationFile), { recursive: true });
  await writeFile(destinationFile, parts.join(''), 'utf8');
}

await assemble('src-parts', 'src/index.js');
await assemble('public-parts', 'public/index.html');
console.log('Octopus V7.7 sources assembled.');
