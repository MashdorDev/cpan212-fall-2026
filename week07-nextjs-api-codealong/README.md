# Week 7 codealong: Next.js with the Express API

Tonight the Next.js app stops using fake data and talks to the real Express API. Open this folder in class. Everything is already built except 5 small steps, marked `TODO STEP` in the code. Each TODO tells you what to type, why, and what you should see after.

Stuck on a step? Open the same file in [`../week07-nextjs-api`](../week07-nextjs-api). That's the finished version.

## Start (two terminals)

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

Open http://localhost:3000/events. It says **Showing 0 of 0 events**. That's normal: the app doesn't talk to the API yet.

## The steps

- [ ] **Step 1**, `web/lib/events.js`: load the events from the API. You should see "Showing 8 of 8 events".
- [ ] **Step 2**, `web/lib/events.js`: load one event. Clicking an event opens its page, and an unknown id shows the 404 page.
- [ ] **Step 3**, `web/next.config.mjs`: the rewrite, so `/api/...` on port 3000 goes to the API on port 4000. Restart `npm run dev`, then http://localhost:3000/api/events shows JSON.
- [ ] **Step 4**, `web/app/events/new/page.js`: the create form sends the new event to the API. Empty form: red messages. Filled form: you land on the new event.
- [ ] **Step 5**, `web/components/SaveButton.js`: Save buttons share one list. Saved events show up on http://localhost:3000/saved and stay after a reload.

Do them in order. Step 4 needs step 3.
