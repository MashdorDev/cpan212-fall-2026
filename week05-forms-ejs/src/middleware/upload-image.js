import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { UPLOADS_DIR } from '../utils/uploads.js';
import { HttpError } from '../utils/http-error.js';

// The image types we accept, and the extension each one is saved with.
const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

// Multer asks us for a file name. We never use the name the browser sent:
// it can contain "../", two people can both send "poster.png", and it can lie about the type.
function chooseFileName(req, file, cb) {
  const extension = EXTENSIONS[file.mimetype];
  const fileName = randomUUID() + extension;
  cb(null, fileName);
}

// Multer asks us about every file before saving it.
function checkFileType(req, file, cb) {
  if (EXTENSIONS[file.mimetype]) {
    cb(null, true); // yes, save it
  } else {
    cb(new HttpError(400, 'Image must be a JPEG, PNG or WebP file'));
  }
}

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: chooseFileName,
});

const TWO_MB = 2 * 1024 * 1024;

const upload = multer({
  storage: storage,
  limits: { fileSize: TWO_MB },
  fileFilter: checkFileType,
});

export function uploadImage(req, res, next) {
  // Multer gives back a middleware that reads the "image" field.
  const readImage = upload.single('image');

  // Multer calls this function when it is done.
  readImage(req, res, function (error) {
    if (error instanceof multer.MulterError) {
      // The only Multer error we can get here is "file too big".
      next(new HttpError(400, 'Image must be 2 MB or smaller'));
    } else {
      next(error);
    }
  });
}
