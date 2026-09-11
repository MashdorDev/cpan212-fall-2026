// Three lookups for one event that each take a while, like three separate API calls.
// They use setTimeout so the timings are the same on every computer and no network is needed.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getRoomBooking() {
  await wait(400);
  return 'North Campus, Room B204';
}

async function getRegistrationCount() {
  await wait(700);
  return 38;
}

async function getCateringOrder() {
  await wait(300);
  return '4 large pizzas';
}

async function getParkingPasses() {
  await wait(200);
  throw new Error('The parking service is down');
}

async function timed(label, work) {
  const started = performance.now();
  const result = await work();
  console.log(`${label} took ${Math.round(performance.now() - started)} ms:`, result);
}

// 1. One after another. Each await waits for the previous lookup, so the times add up (about 1400 ms).
await timed('Sequential', async () => {
  const room = await getRoomBooking();
  const registrations = await getRegistrationCount();
  const catering = await getCateringOrder();
  return [room, registrations, catering];
});

// 2. Promise.all starts all three at once and waits for the slowest one (about 700 ms).
// Only do this when the lookups don't depend on each other.
await timed('Promise.all', () => Promise.all([getRoomBooking(), getRegistrationCount(), getCateringOrder()]));

// 3. Promise.all rejects as soon as one promise rejects. The successful results are lost.
try {
  await Promise.all([getRoomBooking(), getParkingPasses(), getCateringOrder()]);
} catch (error) {
  console.log('Promise.all failed:', error.message);
}

// 4. Promise.allSettled always waits for every promise and tells you how each one ended.
const results = await Promise.allSettled([getRoomBooking(), getParkingPasses(), getCateringOrder()]);
for (const result of results) {
  if (result.status === 'fulfilled') {
    console.log('fulfilled:', result.value);
  } else {
    console.log('rejected:', result.reason.message);
  }
}
