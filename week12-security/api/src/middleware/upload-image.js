import { randomUUID } from 'node:crypto';
import { open, unlink } from 'node:fs/promises';
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

// Every JPEG, PNG and WebP file starts with a fixed pattern of bytes (its "magic number"),
// whatever the file is called and whatever the browser says it is.
const SIGNATURES = {
  'image/jpeg': (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  'image/png': (bytes) => bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  // "RIFF", four bytes of file size, then "WEBP".
  'image/webp': (bytes) => bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => cb(null, `${randomUUID()}${EXTENSIONS[file.mimetype]}`),
  }),
  // files: one image. fields and fieldSize cap the text fields that come with it, so a form can't send
  // thousands of fields or megabytes of text.
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 20, fieldSize: 10 * 1024 },
  fileFilter: (req, file, cb) => {
    // file.mimetype is what the browser reports, usually based on the extension. It catches honest
    // mistakes like a PDF or a .heic photo. The signature check below catches a renamed file.
    if (EXTENSIONS[file.mimetype]) {
      return cb(null, true);
    }
    // Skip the file but keep reading the other fields, so the form can be shown again with the user's values.
    req.uploadError = 'Image must be a JPEG, PNG or WebP file';
    cb(null, false);
  },
});

async function readFirstBytes(filePath, count) {
  const file = await open(filePath);
  try {
    const { buffer, bytesRead } = await file.read(Buffer.alloc(count), 0, count, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await file.close();
  }
}

// Multer has saved the file by now. If its first bytes don't match the type the browser claimed
// (a text file renamed to photo.png, for example), delete it and report an upload error.
async function rejectFakeImage(req) {
  if (!req.file) {
    return;
  }
  const firstBytes = await readFirstBytes(req.file.path, 12);
  if (!SIGNATURES[req.file.mimetype](firstBytes)) {
    await unlink(req.file.path);
    req.file = undefined;
    req.uploadError = 'That file is not a real JPEG, PNG or WebP image';
  }
}

// Runs Multer for the "image" field. Upload problems become a message for the form
// instead of going to the error handler.
export function uploadImage(req, res, next) {
  upload.single('image')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      req.uploadError = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 2 MB or smaller' : `Upload failed: ${error.message}`;
      return next();
    }
    if (error) {
      return next(error);
    }
    rejectFakeImage(req).then(() => next(), next);
  });
}
