import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const eventsPath = path.join(import.meta.dirname, 'data', 'events.json');
const outputDir = path.join(import.meta.dirname, 'output');

// await pauses this function until the promise settles, without blocking the rest of the program.
// An async function always returns a promise.
async function saveTitles() {
  const text = await readFile(eventsPath, 'utf8');
  const events = JSON.parse(text);
  console.log(`Read ${events.length} events`);

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'titles.txt'), events.map((event) => event.title).join('\n'));
  return events.length;
}

// A rejected promise makes await throw, so errors are handled with a normal try/catch.
try {
  const count = await saveTitles();
  console.log(`Saved ${count} titles to output/titles.txt`);
} catch (error) {
  console.error('Something failed:', error.message);
}

try {
  await readFile(path.join(import.meta.dirname, 'data', 'missing.json'), 'utf8');
} catch (error) {
  console.log(`Reading a missing file threw ${error.code}`);
}

// ES modules allow await at the top level of the file, which is what the try blocks above use.
