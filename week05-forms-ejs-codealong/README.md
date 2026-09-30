# Week 5 codealong: how Express works, forms, uploads and EJS

This is the folder we work in during class. It holds the same project as
[`../week05-forms-ejs`](../week05-forms-ejs), with the code we write together taken out and replaced
by numbered `// TODO (you): STEP N` comments.

The finished version is in [`../week05-forms-ejs`](../week05-forms-ejs). Open it when a step has you
stuck, and to check your work at the end. Try the step first.

## Set up once

```bash
npm install
cp .env.example .env
```

In Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

## Part 1: a mini Express (steps 1 to 4)

`mini-express/server.js` is a small Express app with a logger, a health route, two routes that throw,
a 404 handler and an error handler. It is done. You write `mini-express/mini-express.js`, the
engine it runs on. Start it with:

```bash
node --watch mini-express/server.js
```

Before step 1 every request answers `Mini Express is not written yet`. Run the same file on the real
Express to see where you're heading:

```bash
node mini-express/server.js express
```

1. Run the layers one after another with `next()`.
2. Skip routes whose method or path don't match.
3. Catch a thrown error and send it to the error handler.
4. Catch errors from `async` handlers too.

`--watch` restarts the server every time you save. If a step crashes it, the terminal waits for
your next save.

## Part 2: the admin pages (steps 5 to 12)

This is the Week 4 Campus Events API. The JSON API works from the first minute. You add an admin
area with HTML pages. Stop the mini Express first (Ctrl+C), since both use port 4000:

```bash
npm run dev
```

Open http://localhost:4000/admin/events. Before step 5 it answers `404` in JSON, because nothing is
mounted at `/admin` yet. That is the starting line.

| File | What you write in it | Steps |
|---|---|---|
| `src/app.js` | The view engine, the form body parser, `/uploads`, and mounting the admin router | 5, 7, 9 |
| `src/routes/admin.routes.js` | The four admin routes | 5, 6, 7, 9, 11 |
| `src/controllers/admin.controller.js` | The list page, the form page, saving and deleting | 5 to 11 |
| `src/views/events-index.ejs` | One table row per event | 5 |
| `src/views/events-new.ejs` | The image field | 9 |
| `src/middleware/upload-image.js` | Multer: where files go, their names, limits and errors | 9, 10 |
| `src/middleware/not-found.js`, `error-handler.js` | HTML error pages under `/admin` | 12 |

Everything else is done for you: the seed events, the validator, the date helpers, the header and
footer partials, the form's text fields, the CSS and the JSON API.

5. EJS and the events list page.
6. The empty "New event" form.
7. Read the form, validate it, and show it again with errors.
8. Save a valid event and redirect with 303 (post/redirect/get).
9. Upload an image with Multer and show it in the list.
10. Limit the size and type, and turn upload problems into form messages.
11. Delete with a POST form.
12. HTML error pages for `/admin`.

The lesson page has the code for every step, the check to run after it and the answer you should
see. Run the check before you start the next step.

## Check your work at the end

Delete the comment blocks that explain the codealong: the one at the top of
`mini-express/mini-express.js` (the line starting "This is the codealong file") and the one in
`src/controllers/admin.controller.js` (starting "Each function answers"). Then, from the folder that
holds both projects (in Git Bash on Windows, or any macOS or Linux terminal):

```bash
diff -r week05-forms-ejs-codealong/src week05-forms-ejs/src
diff -r week05-forms-ejs-codealong/mini-express week05-forms-ejs/mini-express
```

No output means your code matches, line for line. Differences in blank lines are fine.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
