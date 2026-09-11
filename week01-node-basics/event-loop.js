import { readFile } from 'node:fs';

console.log('1. synchronous code runs first, top to bottom');

setTimeout(() => console.log('timer callback'), 0);

readFile(import.meta.filename, () => console.log('file read callback'));

Promise.resolve().then(() => console.log('2. promise callbacks run as soon as the synchronous code finishes'));

console.log('1. still synchronous');
