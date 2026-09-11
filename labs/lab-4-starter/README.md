# Lab 4 starter: Plant Shelf

Starter code for CPAN 212 Lab 4. The full instructions, requirements and rubric are on the Lab 4 page.

- `api/` is the Express 5 + Mongoose 9 API. Steps 1 to 6 are in `db.js`, `models/Plant.js`, `routes/plants.routes.js`, `middleware/error-handler.js` and `seed.js`.
- `web/` is the Next.js 16 app. The `/api` rewrite in `next.config.mjs` is already set. Steps 7 and 8 are in `app/page.js` and `app/plant-form.js`.

Every step is marked `TODO (you):`.

## Run it

API, in one terminal:

```bash
cd api
npm install
cp .env.example .env
npm run dev
```

Web app, in a second terminal:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

On Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

The API runs on http://localhost:4000 and the web app on http://localhost:3000.

Replace this README with your own before you submit. The Lab 4 page lists what it must contain.
