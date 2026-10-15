import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { UPLOADS_DIR } from '../utils/uploads.js';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

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
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    // file.mimetype is what the browser reports, usually based on the extension. It catches honest
    // mistakes like a PDF or a .heic photo, not someone who renames a file on purpose.
    if (EXTENSIONS[file.mimetype]) {
      return cb(null, true);
    }
    // Skip the file but keep reading the other fields, so the form can be shown again with the user's values.
    req.uploadError = 'Image must be a JPEG, PNG or WebP file';
    cb(null, false);
  },
});

// Runs Multer for the "image" field. Upload problems become a message for the form
// instead of going to the error handler.
export function uploadImage(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      req.uploadError = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 2 MB or smaller' : `Upload failed: ${error.message}`;
      return next();
    }
    next(error);
  });
}
