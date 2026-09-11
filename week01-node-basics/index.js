import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';
import { loadTasks, summarize } from './src/tasks.js';

const name = process.env.STUDENT_NAME ?? 'student';
// en-CA formats dates as YYYY-MM-DD in the computer's own time zone.
const today = new Date().toLocaleDateString('en-CA');

const tasks = await loadTasks(path.join(import.meta.dirname, 'data', 'tasks.json'));
const summary = summarize(tasks, today);

console.log(pc.bold(`Hi ${name}, here is your setup checklist for ${today}`));
console.log(`${pc.green(summary.done)} done, ${pc.yellow(summary.open)} still open`);

for (const task of summary.overdue) {
  console.log(pc.red(`Overdue: ${task.title} (was due ${task.due})`));
}

if (summary.nextUp) {
  console.log(`Next up: ${summary.nextUp.title}, due ${summary.nextUp.due}`);
}

const outputDir = path.join(import.meta.dirname, 'output');
await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'summary.txt'), JSON.stringify(summary, null, 2));
console.log(`Saved ${path.relative(process.cwd(), path.join(outputDir, 'summary.txt'))}`);
