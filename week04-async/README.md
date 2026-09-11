# Week 4: Async JavaScript

Two folders:

- `examples/` has short scripts that build up async JavaScript one step at a time. They only use Node's built-in modules, so there is nothing to install.
- `api/` is the Week 3 Campus Events API plus an endpoint that calls a third-party API (Nager.Date) with a timeout and a cache.

## Examples

```bash
cd examples
node 01-callbacks.js
```

| File | What it shows |
|---|---|
| `01-callbacks.js` | Reading and writing files with error-first callbacks, and why nesting gets deep |
| `02-promises.js` | The same work with promises and `then()` / `catch()` |
| `03-async-await.js` | The same work with `async` / `await` and `try` / `catch` |
| `04-promise-all.js` | Sequential awaits vs `Promise.all`, and `Promise.allSettled` when one call fails |
| `05-fetch-timeout.js` | `fetch` with `AbortSignal.timeout`, checking `res.ok`, and what a timeout error looks like |
| `06-event-loop-blocking.js` | How a synchronous loop freezes timers (and every request on a server) |

`05-fetch-timeout.js` needs an internet connection for its first two parts. The scripts that write files put them in `examples/output/`.

## API

See `api/README.md`.
