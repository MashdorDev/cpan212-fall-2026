'use client';

import styles from './page.module.css';

// TODO (you): step 8, make the form save a plant (requirements 13 and 14). The inputs
// already have the names the API expects.
//   1. Import useState from 'react' and useRouter from 'next/navigation'. Keep
//      state for the field errors (an object), a status message and a saving flag.
//   2. In handleSubmit, build an object from new FormData(event.currentTarget)
//      and leave out empty values, so a blank name gets the API's "Name is required".
//   3. POST it as JSON to '/api/plants'. Use that relative URL: the rewrite in
//      next.config.mjs forwards it to Express.
//   4. If !res.ok, store body.error.details and show each message under its input
//      with <span className={styles.fieldError}>. Show body.error.message too.
//   5. If it worked, clear the form (form.reset()), show "Added <name>" and call
//      router.refresh() so the list above fetches the plants again.
//   6. Disable the button while saving. If fetch throws, say the API can't be reached.
export default function PlantForm() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    // noValidate turns off the browser's own checks, so you see the API's messages.
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" />
      </div>

      <div className={styles.field}>
        <label htmlFor="species">Species (optional)</label>
        <input id="species" name="species" />
      </div>

      <div className={styles.field}>
        <label htmlFor="light">Light</label>
        <select id="light" name="light" defaultValue="">
          <option value="">Choose...</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="bright">Bright</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="waterEveryDays">Water every (days)</label>
        <input id="waterEveryDays" name="waterEveryDays" type="number" />
      </div>

      <div className={styles.field}>
        <label htmlFor="lastWatered">Last watered (optional)</label>
        <input id="lastWatered" name="lastWatered" type="date" />
      </div>

      <button className={styles.button} type="submit">
        Add plant
      </button>
    </form>
  );
}
