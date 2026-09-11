import { readFile } from 'node:fs/promises';

export async function loadTasks(filePath) {
  const text = await readFile(filePath, 'utf8');
  return JSON.parse(text);
}

// YYYY-MM-DD strings sort in date order, so plain string comparison works.
export function summarize(tasks, today) {
  const open = tasks.filter((task) => !task.done);
  return {
    total: tasks.length,
    done: tasks.length - open.length,
    open: open.length,
    overdue: open.filter((task) => task.due < today),
    nextUp: open.toSorted((a, b) => a.due.localeCompare(b.due))[0] ?? null,
  };
}
