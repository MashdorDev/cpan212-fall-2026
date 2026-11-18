# Week 10: Campus Events web app

The Week 9 web app with the list driven by the URL, and an RSVP form on each event. Start the API first (see the week README).

```bash
npm install
cp .env.example .env
npm run dev
```

The category, sort and page live in the URL: `/events?category=arts&sort=title&page=2`. Every filter and page link is a plain link, so Back and Forward work and you can share a filtered list. There is no `useState` on the list page.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `API_ORIGIN` | `http://localhost:4000` | Where the Express API runs |
