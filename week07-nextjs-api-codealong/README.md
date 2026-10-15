# Week 7 codealong: Next.js with the Express API

**Open this folder in class.** It has the Week 7 app with the parts we write together taken out
and replaced by `// TODO (you): STEP N` comments. Everything else is done: the Express API in
`api/`, the pages, the CSS, the saved-events Context and the `/saved` page.

The finished version is in [`../week07-nextjs-api`](../week07-nextjs-api). Open it when a step has
you stuck, and to check your work at the end. Try the step first.

## Set up once (two terminals)

Terminal 1, the API:

```bash
cd api
npm install
cp .env.example .env
npm run dev
```

Terminal 2, the Next.js app:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000/events. It says **Showing 0 of 0 events**. That's the starting line:
the app does not talk to the API yet.

## Steps

| Step | What you build | File |
|---|---|---|
| 1 | Load the events from the API | `web/lib/events.js` |
| 2 | Load one event, and a 404 for unknown ids | `web/lib/events.js` |
| 3 | The rewrite: `/api/...` on port 3000 goes to the API on port 4000 | `web/next.config.mjs` |
| 4 | The create form sends the new event to the API | `web/app/events/new/page.js` |
| 5 | Save buttons share one list through Context | `web/components/SaveButton.js` |

The lesson page has the code for every step, the check to run after it and the answer you should
see.

## Check your work at the end

From the folder that holds both projects (in Git Bash on Windows, or any macOS or Linux terminal):

```bash
diff -r --strip-trailing-cr -x node_modules -x .next -x .env week07-nextjs-api-codealong/web week07-nextjs-api/web
```

No output means your code matches, line for line. `--strip-trailing-cr` stops Windows line
endings from making every line look different. Differences in blank lines are fine.
