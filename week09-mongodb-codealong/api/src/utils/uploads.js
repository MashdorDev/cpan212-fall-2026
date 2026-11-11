import { unlink } from 'node:fs/promises';
import path from 'node:path';

export const UPLOADS_DIR = path.join(import.meta.dirname, '..', '..', 'uploads');

// Deletes the file behind an "/uploads/..." image URL. Other URLs (or null) are left alone.
export async function removeUpload(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl.startsWith('/uploads/')) {
    return;
  }
  // basename() keeps only the file name, so a URL like "/uploads/../src/app.js" can't reach outside uploads/.
  const filePath = path.join(UPLOADS_DIR, path.basename(imageUrl));
  try {
    await unlink(filePath);
  } catch (error) {
    // Already gone is fine (for example, someone cleared uploads/). Anything else is a real problem.
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}
