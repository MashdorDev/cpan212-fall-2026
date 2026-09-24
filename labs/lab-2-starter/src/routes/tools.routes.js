import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { tools, CATEGORIES } from '../data/tools.js';
import { validateTool } from '../middleware/validate-tool.js';

// app.js mounts this router at /api/tools, so the paths below start after that:
// '/' here means /api/tools, and '/:id' means /api/tools/<some id>.
export const toolsRouter = Router();

// GET /api/tools sends every tool. This route already works.
toolsRouter.get('/', (req, res) => {
  // TODO (you): STEP 2. Replace this whole route with the one from the lab page.
  res.json({ data: tools });
});

// TODO (you): STEP 3. GET /api/tools/:id sends one tool.

// TODO (you): STEP 5. POST /api/tools adds a tool.

// TODO (you): STEP 6. PUT /api/tools/:id changes a tool.

// TODO (you): STEP 7. DELETE /api/tools/:id removes a tool.
