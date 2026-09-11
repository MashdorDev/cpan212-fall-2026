# Lab 3 starter: Lost Pets Board

Starter code for CPAN 212 Lab 3. The instructions and rubric are on the Lab 3 page.

Replace this README with your own before you submit. It needs what the project is, how to run it, the environment variables, the upload rules, and an AI use section.

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:4000. The list page works from the start and shows "No lost pets reported right now."

## What's already here

- `package.json` with Express 5, EJS 6 and Multer 2.3, and the `dev` and `start` scripts
- `src/server.js` starts the server on `PORT` (default 4000)
- `src/app.js` sets up EJS, the stylesheet and the router
- `src/data/notices.js` keeps notices in memory: `listNotices()`, `addNotice(fields)`, `removeNotice(id)`
- `src/public/styles.css` styles every class the TODO comments mention

## What you write

Search the project for `TODO (you):`. A good order: the partials, the form page, `src/middleware/upload.js`, `src/validators/notice.js`, the POST route, the list, delete, and the 404 page.
