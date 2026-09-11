# Week 12: Campus Events web app

The same app as Week 11. This week's changes are all in the API (see the week README), and the web app keeps working because its browser code only talks to its own origin through the `/api` rewrite:

- The API's CORS allowlist doesn't affect it: the rewrite forwards requests server to server, where CORS doesn't apply.
- The API's Content Security Policy is sent on JSON responses and API pages, not on the Next.js pages.
- The login rate limit applies to its login and register forms. After 10 attempts in 15 minutes, the form shows "Too many login or register attempts".

Start the API first, then:

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `API_ORIGIN` | `http://localhost:4000` | Where the Express API runs |
