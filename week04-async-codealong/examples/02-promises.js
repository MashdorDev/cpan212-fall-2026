import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const eventsPath = path.join(import.meta.dirname, 'data', 'events.json');
const outputDir = path.join(import.meta.dirname, 'output');

// The promise versions of the fs functions take no callback. They return a promise right away.
const promise = readFile(eventsPath, 'utf8');
console.log('1. readFile returned:', promise);

// then() runs when the promise is fulfilled. Returning a promise from then() makes the next then() wait for it.
promise
  .then((text) => {
    const events = JSON.parse(text);
    console.log(`3. Read ${events.length} events`);
    return mkdir(outputDir, { recursive: true }).then(() => events);
  })
  .then((events) => {
    const titles = events.map((event) => event.title).join('\n');
    return writeFile(path.join(outputDir, 'titles.txt'), titles);
  })
  .then(() => console.log('4. Saved output/titles.txt'))
  // One catch() at the end handles an error from any step above.
  .catch((error) => console.error('Something failed:', error.message));

console.log('2. This line still runs before the file has been read');

// You can also make your own promise. This one is fulfilled after ms milliseconds.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

wait(500).then(() => console.log('5. Half a second later'));
