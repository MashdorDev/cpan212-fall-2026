import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { UPLOADS_DIR } from '../utils/uploads.js';
import { HttpError } from '../utils/http-error.js';

// Allowed types and the extension each one is saved with. The browser's file name is never used:
// it can contain "../", be very long, or say .jpg for a file that isn't one.
const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => cb(null, `${randomUUID()}${EXTENSIONS[file.mimetype]}`),
  }),
  // 2 MB, in bytes. Without a limit, one request can fill the disk.
  limits: { fileSize: 2 * 1024 * 1024 },
  // Runs before a file is saved. cb(null, true) keeps the file, cb(error) stops the upload.
  fileFilter: (req, file, cb) => {
    if (EXTENSIONS[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new HttpError(400, 'Image must be a JPEG, PNG or WebP file'));
    }
  },
});

export function uploadImage(req, res, next) {
  upload.single('image')(req, res, (error) => {
    // Multer reports a file over the limit with a MulterError. It's the user's mistake, so make it a 400.
    if (error instanceof multer.MulterError) {
      return next(new HttpError(400, 'Image must be 2 MB or smaller'));
    }
    next(error);
  });
}
