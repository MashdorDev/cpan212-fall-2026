import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { tools, CATEGORIES } from '../data/tools.js';
import { validateTool } from '../middleware/validate-tool.js';

// app.js mounts this router at /api/tools, so the paths below start after that:
// '/' here means /api/tools, and '/:id' means /api/tools/<some id>.
export const toolsRouter = Router();

// GET /api/tools sends every tool. This route already works.
toolsRouter.get('/', (req, res) => {
  // TODO (you): STEP 2. Filter by category.
  //   req.query.category holds the value from ?category=garden, or undefined when the URL has none.
  //   - No category: send every tool, like this route does now.
  //   - A category that isn't in CATEGORIES: respond 400 with
  //     { error: { message: 'Invalid query', details: { category: 'category must be one of: power, hand, garden, cleaning' } } }
  //   - Otherwise: send only the tools in that category. tools.filter(...) builds that list.
  res.json({ data: tools });
});

// TODO (you): STEP 3. GET /api/tools/:id sends one tool.
//   Start with: toolsRouter.get('/:id', (req, res) => { ... });
//   req.params.id is the id from the URL. tools.find(...) gives you the tool, or undefined.
//   Found: respond with { data: tool }. Not found: respond 404 with { error: { message: 'Tool not found' } }.

// TODO (you): STEP 5. POST /api/tools creates a tool.
//   Start with: toolsRouter.post('/', validateTool, (req, res) => { ... });
//   validateTool runs first, so inside your function req.body is already checked and cleaned.
//   Build the tool as { id: randomUUID(), ...req.body }, push it onto tools,
//   and respond 201 with { data: tool }.

// TODO (you): STEP 6. PUT /api/tools/:id replaces a tool's five fields.
//   Start with: toolsRouter.put('/:id', validateTool, (req, res) => { ... });
//   Find the tool like in step 3 (404 when it isn't there).
//   Object.assign(tool, req.body) copies the five new fields onto it and keeps its id.
//   Respond 200 with { data: tool }.

// TODO (you): STEP 7. DELETE /api/tools/:id removes a tool.
//   Start with: toolsRouter.delete('/:id', (req, res) => { ... });
//   tools.findIndex(...) gives the tool's position, or -1 when it isn't there (respond 404).
//   tools.splice(index, 1) removes it. Then res.status(204).end() sends "No Content" with no body.
