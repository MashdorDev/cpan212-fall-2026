# Week 6 codealong: React with Next.js

This is the folder we work in during class. It holds the same app as
[`../week06-nextjs-basics`](../week06-nextjs-basics), with the components we write together taken
out and replaced by `// TODO (you): STEP N` comments. The layout, the home page, the CSS and the
data in `lib/` are done.

The finished version is in [`../week06-nextjs-basics`](../week06-nextjs-basics). Open it when a step
has you stuck, and to check your work at the end. Try the step first.

## Set up once

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000. The home page works, and **Events** only says "Events". That's the
starting line.

## Steps

| Step | What you build | Files |
|---|---|---|
| 1 | The events page loads the events on the server | `app/events/(list)/page.js` |
| 2 | A card for every event: props, `map()` and `key` | `components/EventCard.js`, `components/CategoryFilter.js`, `app/events/(list)/page.js` |
| 3 | Category buttons that filter the list: `useState`, `onClick`, `'use client'` | `components/CategoryFilter.js` |
| 4 | A Save button on every card | `components/SaveButton.js`, `components/EventCard.js` |
| 5 | A page for each event, with a 404 for unknown ids | new file `app/events/[id]/page.js` |
| 6 | Loading, error and not-found screens | new files `app/events/(list)/loading.js`, `app/events/error.js`, `app/not-found.js` |

The lesson page has the code for every step, the check to run after it and the answer you should
see.

## Check your work at the end

From the folder that holds both projects (in Git Bash on Windows, or any macOS or Linux terminal):

```bash
diff -r -x node_modules -x .next week06-nextjs-basics-codealong/web week06-nextjs-basics/web
```

No output means your code matches, line for line. Differences in blank lines are fine.
