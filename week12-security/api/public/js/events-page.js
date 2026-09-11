// The script for public/index.html. It used to sit inside a <script> tag in the page, and the Content Security
// Policy from helmet blocks inline scripts: script-src 'self' only allows files served by this site.
// That rule is what stops an injected <script>alert(1)</script> from running.
const status = document.querySelector('#status');
const list = document.querySelector('#events');

const dateFormat = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Toronto',
});

async function showEvents() {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) {
      throw new Error(`The API answered ${res.status}`);
    }
    const { data, total } = await res.json();

    for (const event of data) {
      const item = document.createElement('li');
      const title = document.createElement('strong');
      const meta = document.createElement('div');
      // textContent (not innerHTML) so a title like "<script>" shows as text instead of running.
      title.textContent = event.title;
      meta.className = 'meta';
      meta.textContent = `${dateFormat.format(new Date(event.startsAt))} | ${event.location} | ${event.category}`;
      item.append(title, meta);
      list.append(item);
    }
    // The API sends one page at a time, so data.length can be smaller than total.
    status.textContent = `Showing ${data.length} of ${total} events`;
  } catch (error) {
    status.textContent = `Could not load events: ${error.message}`;
  }
}

showEvents();
