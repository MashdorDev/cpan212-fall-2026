import { mkdir, readFile, writeFile } from 'node:fs';
import path from 'node:path';

const eventsPath = path.join(import.meta.dirname, 'data', 'events.json');
const outputDir = path.join(import.meta.dirname, 'output');

console.log('1. Asking Node to read the file');

// Node calls the function when the file has been read. The first argument is always the error
// (null when things worked), so check it before using the result.
readFile(eventsPath, 'utf8', (error, text) => {
  if (error) {
    console.error('Could not read the file:', error.message);
    return;
  }
  const events = JSON.parse(text);
  console.log(`3. Read ${events.length} events`);

  // Each step that depends on the previous one goes one level deeper.
  mkdir(outputDir, { recursive: true }, (error) => {
    if (error) {
      console.error('Could not create the folder:', error.message);
      return;
    }
    const titles = events.map((event) => event.title).join('\n');

    writeFile(path.join(outputDir, 'titles.txt'), titles, (error) => {
      if (error) {
        console.error('Could not write the file:', error.message);
        return;
      }
      console.log('4. Saved output/titles.txt');
    });
  });
});

console.log('2. This line runs before the file has been read');

readFile(path.join(import.meta.dirname, 'data', 'missing.json'), 'utf8', (error) => {
  if (error) {
    console.log(`A missing file gives an error object instead of throwing: ${error.code}`);
  }
});
