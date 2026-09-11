// Node runs your JavaScript on one thread. While a synchronous loop is running,
// timers, file callbacks and incoming HTTP requests all have to wait for it to finish.

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function blockFor(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // Spinning here keeps the thread busy, like a heavy calculation would.
  }
}

let last = performance.now();
const ticker = setInterval(() => {
  const now = performance.now();
  console.log(`  tick (${Math.round(now - last)} ms since the last tick)`);
  last = now;
}, 250);

await wait(800);
console.log('Blocking for 1500 ms with a synchronous loop. Watch for the missing ticks.');
blockFor(1500);
console.log('Done blocking');

await wait(800);
console.log('Waiting 1500 ms with await instead. The ticks keep coming.');
await wait(1500);
console.log('Done waiting');

clearInterval(ticker);
