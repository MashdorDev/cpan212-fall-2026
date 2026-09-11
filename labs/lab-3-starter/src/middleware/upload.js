import path from 'node:path';

// uploads/ sits at the project root, next to package.json. It's listed in
// .gitignore, so photos people upload are never committed.
export const UPLOAD_DIR = path.join(import.meta.dirname, '..', '..', 'uploads');

// TODO (you): import multer and randomUUID, then configure Multer:
//   1. multer.diskStorage with destination UPLOAD_DIR and a filename function
//      that returns randomUUID() plus an extension chosen from file.mimetype
//      (.jpg for image/jpeg, .png for image/png, .webp for image/webp).
//      Never use file.originalname.
//   2. limits.fileSize of 2 MB (2 * 1024 * 1024 bytes).
//   3. a fileFilter that only accepts image/jpeg, image/png and image/webp.
//
// TODO (you): export a middleware for the POST /notices route that runs
// upload.single('photo'). A file that is too large or of the wrong type must
// end up as a message on the form (status 400), not as a crash or a 500 page,
// so your route needs a way to find out what went wrong.
