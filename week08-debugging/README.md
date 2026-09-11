# Week 8: Debugging a full-stack app

This is the Week 7 Campus Events app (Express API plus Next.js) with **several bugs hidden in it**. We find and fix them together in class, using the browser's devtools (Console and Network tabs), the terminal output of both servers, Bruno, and `npm run build`.

The code is not marked in any way. If something looks wrong, it may well be.

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

Open http://localhost:3000. The Bruno collection is in `api/bruno/` (pick the `Local` environment, which points at port 4100).

## Environment variables

| Folder | Name | Value in `.env.example` | Purpose |
|---|---|---|---|
| `api` | `PORT` | `4100` | Port the API listens on |
| `api` | `HOLIDAY_API_BASE_URL` | `https://date.nager.at/api/v3` | Base URL of the holiday API |
| `web` | `API_ORIGIN` | `http://localhost:4100` | Where the API runs |

## Things to try

- Browse the events list, open an event, save a few events and open the saved page.
- Create an event with valid data, then with invalid data.
- Run the whole Bruno collection.
- Think about what happens when this code runs on a Linux computer (a Render server, GitHub Codespaces, WSL) instead of your laptop.

For each problem you find, write down what you saw, where you looked, what the cause was, and how you fixed it.
