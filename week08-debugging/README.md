# Week 8: Debugging a full-stack app

This is the Week 7 Campus Events app (Express API plus Next.js) with **5 bugs hidden in it**. We find and fix them together in class with the tools you already have: the two terminals, the browser's Network tab, `console.log` and `curl`.

The bugs are not marked. The lesson page walks through them one at a time.

The fixed code is the same as [`../week07-nextjs-api`](../week07-nextjs-api) (only the port is different). Open the same file there if you get stuck.

## Run it (two terminals)

This week the API runs on port **4100**, so it doesn't clash with your own project API on 4000.

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

Open http://localhost:3000/events. The list works. Most other things don't, and that's the point.

## Environment variables

| Folder | Name | Value in `.env.example` | Purpose |
|---|---|---|---|
| `api` | `PORT` | `4100` | Port the API listens on |
| `api` | `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
| `web` | `API_ORIGIN` | `http://localhost:4100` | Where the API runs |

## Things to try

- Open an event from the list.
- Save a few events and open the Saved page.
- Create an event with valid data, then with the form empty.
- Send `curl` requests straight to the API on port 4100, to tell an API bug from a web app bug.

For each bug, write down what you saw, where you looked, what the cause was, and how you fixed it.
