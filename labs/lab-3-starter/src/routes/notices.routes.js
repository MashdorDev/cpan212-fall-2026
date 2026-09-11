import { Router } from 'express';
import { listNotices } from '../data/notices.js';

export const noticesRouter = Router();

noticesRouter.get('/', (req, res) => {
  res.render('index', { title: 'Lost pets', notices: listNotices() });
});

// TODO (you): GET /notices/new renders views/new.ejs with a title, the SPECIES
// list, empty values and no errors.

// TODO (you): POST /notices
//   1. Run your upload middleware first, so req.body and req.file are ready.
//   2. Validate the fields with validateNotice, and add a photo error when the
//      upload failed or no photo was sent.
//   3. If anything is invalid: delete the saved photo (if there is one),
//      then render new.ejs again with status 400, the typed values and the errors.
//   4. Otherwise save the notice with addNotice() and redirect to /.

// TODO (you): POST /notices/:id/delete removes the notice with removeNotice(),
// deletes its photo from UPLOAD_DIR with unlink from node:fs/promises, and
// redirects to /. An unknown id renders the not-found page with status 404.
