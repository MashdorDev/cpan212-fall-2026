# Week 9: Campus Events web app

The Week 7 web app, unchanged. It now runs against the Week 9 API, which keeps the events in MongoDB. Start the API first (see the week README).

```bash
npm install
cp .env.example .env
npm run dev
```

Nothing had to change here: the API still sends `id`, because the `toJSON` transform in `api/src/models/Event.js` renames MongoDB's `_id`. The ids are now 24-character MongoDB ids instead of UUIDs, so events you saved in Week 7 (kept in your browser) don't match anything and the Saved page starts empty.

## Environment variables

| Name | Default | Purpose |
|---|---|---|
| `API_ORIGIN` | `http://localhost:4000` | Where the Express API runs |
