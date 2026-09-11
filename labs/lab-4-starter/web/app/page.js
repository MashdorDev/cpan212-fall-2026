import PlantForm from './plant-form';
import styles from './page.module.css';

// TODO (you): step 7, the list (requirement 13). This is a server component, so
// it runs on the Next.js server and can call Express directly.
//   1. Above the component: const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:4000';
//   2. Import { connection } from 'next/server' and make `await connection();` the
//      first line of the component. Without it, npm run build tries to fetch the
//      list at build time, and fails when the API isn't running.
//   3. Fetch `${API_ORIGIN}/api/plants?sort=name`. If !res.ok, throw an Error.
//      Otherwise read the array with await res.json().
//   4. Replace the paragraph below with a <ul className={styles.list}>. For each plant, an
//      <li key={plant._id} className={styles.item}> with its name, species (when
//      there is one), light and "Water every N days".
//   5. When the array is empty, show <p className={styles.empty}>No plants yet.</p> instead.
export default async function HomePage() {
  return (
    <>
      <h1>Plant Shelf</h1>

      <h2>Your plants</h2>
      <p className={styles.empty}>The plant list goes here.</p>

      <h2>Add a plant</h2>
      <PlantForm />
    </>
  );
}
