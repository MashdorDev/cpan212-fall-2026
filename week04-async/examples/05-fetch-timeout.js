import http from 'node:http';

const HOLIDAY_API = 'https://date.nager.at/api/v3/PublicHolidays';

async function getHolidays(year) {
  // Without a signal, fetch can wait for a very long time on a server that never answers.
  const res = await fetch(`${HOLIDAY_API}/${year}/CA`, { signal: AbortSignal.timeout(5000) });
  // fetch resolves for any HTTP status, including 400 and 500. Only a network failure or a timeout rejects.
  if (!res.ok) {
    throw new Error(`Nager.Date answered ${res.status} for ${year}`);
  }
  return res.json();
}

// 1. A request that works
try {
  const holidays = await getHolidays(2026);
  const thanksgiving = holidays.find((holiday) => holiday.name === 'Thanksgiving');
  console.log(`2026 has ${holidays.length} Canadian holiday entries. Thanksgiving is on ${thanksgiving.date}`);
} catch (error) {
  console.error(`${error.name}: ${error.message}`);
}

// 2. A request the API rejects. res.ok is false, so getHolidays throws our own error.
try {
  await getHolidays(1900);
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
}

// 3. A server that is too slow. It waits 3 seconds before answering, and the request gives up after 1.
const slowServer = http.createServer((req, res) => {
  setTimeout(() => res.end('finally'), 3000);
});
await new Promise((resolve) => slowServer.listen(0, resolve));
const { port } = slowServer.address();

const started = performance.now();
try {
  await fetch(`http://localhost:${port}`, { signal: AbortSignal.timeout(1000) });
} catch (error) {
  console.log(`${error.name} after ${Math.round(performance.now() - started)} ms: ${error.message}`);
} finally {
  slowServer.closeAllConnections();
  slowServer.close();
}
