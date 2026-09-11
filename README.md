# CPAN 212 Modern Web Technologies, Fall 2026

Class code for CPAN 212 at Humber Polytechnic. Each `weekNN-...` folder is a complete, runnable snapshot of what we build in that week's class, so you can open any week and run it on its own.

From Week 2 on, the folders build one app step by step: **Campus Events**, a board of events happening on campus. The same seed events, fields and API routes carry through every week, so you can compare two weeks side by side and see exactly what changed. From Week 9 the events live in MongoDB, so their ids come from the database and change each time you run `npm run seed`.

Lesson pages, labs, assignments and the project are on the course pages, not in this repo.

## Running a week folder

You need Node.js 24 (`node -v` should print `v24.x`). Every project has a `.nvmrc`, so `nvm use` picks the right version.

```bash
cd week03-express
npm install
cp .env.example .env
npm run dev
```

- `npm install` reads `package.json` and `package-lock.json` and downloads the dependencies into `node_modules/` (never committed).
- `.env.example` lists every environment variable the project reads, with safe example values. Copy it to `.env` and change values there. `.env` is never committed.
- `npm run dev` starts the project and restarts it when you save a file. Express APIs run on http://localhost:4000, Next.js apps on http://localhost:3000.

Some weeks have more than one project (for example `api/` and `web/`). Each one has its own `package.json`, and the week's README explains how to run them together.

From Week 9 the API needs a MongoDB connection string in `MONGODB_URI` (a free Atlas cluster or MongoDB on your own computer, see `week09-mongodb/docs/atlas-setup.md`), and from Week 11 a `SESSION_SECRET`. Run `npm run seed` in `api/` to load sample data.

API folders include a `bruno/` collection. Open it in [Bruno](https://www.usebruno.com) and pick the `Local` environment to send a request to every route.

## Weeks

| Folder | What is in it |
|---|---|
| `week01-node-basics/` | Node basics: ES modules, npm packages, reading and writing files, environment variables |
| `week02-http-server/` | The Campus Events API with Node's built-in `node:http` module and no dependencies |
| `week03-express/` | The same API in Express 5 with routers, controllers, middleware and full create, read, update, delete |
| `week04-async/` | Step-by-step async examples, and the API calling a third-party holiday API with a timeout and a cache |
| `week05-forms-ejs/` | Server-rendered admin pages with EJS, form validation, image uploads with Multer, post/redirect/get |
| `week06-nextjs-basics/` | A Next.js app with components, props, state, dynamic routes, loading and error pages (local data) |
| `week07-nextjs-api/` | The Next.js app connected to the Express API with rewrites, a create form and saved events in Context, plus a CORS example |
| `week08-debugging/` | The Week 7 app with bugs to find and fix in class |
| `week09-mongodb/` | The API on MongoDB with Mongoose: schema validation, a seed script, and the native driver for comparison |
| `week10-mongoose-queries/` | Filters, search, sorting and pagination, indexes, RSVPs with `populate`, and a NoSQL injection demo |
| `week11-auth/` | Accounts: hashed passwords, sessions stored in MongoDB, protected routes and pages, organizer-only edits, a JWT example |
| `week12-security/` | Hardening: helmet and a CSP, rate limits, CORS allowlist, upload checks, a security checklist, local HTTPS notes |
| `week13-deployment/` | Ready to deploy: health check, graceful shutdown, `render.yaml`, Vercel settings and step-by-step deploy notes |

## Starter code

| Folder | Used for |
|---|---|
| `labs/lab-3-starter/` | Lab 3 |
| `labs/lab-4-starter/` | Lab 4 (and Lab 5 if your Lab 4 isn't working) |
| `assignments/assignment-1-starter/` | Assignment 1 |

Copy a starter folder somewhere outside this repository before you start, then create your own repository from the copy, as the handout explains.
