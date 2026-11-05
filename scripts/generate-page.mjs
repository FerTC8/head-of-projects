import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const projectsDataPath = path.join(rootDir, 'data', 'projects.json');
const templatePath = path.join(rootDir, 'templates', 'landing-page.html');
const rootPagesDir = path.join(rootDir, 'pages');
const srcPagesDir = path.join(rootDir, 'src', 'pages');
const distPagesDir = path.join(rootDir, 'dist', 'pages');

[rootPagesDir, srcPagesDir, distPagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const projects = JSON.parse(fs.readFileSync(projectsDataPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

const targetArg = process.argv[2] || '--all';

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateProjectPage(project) {
  const metricsHtml = (project.metrics || [])
    .map(
      (m) => `
        <div class="glass-panel rounded-xl p-4 border border-white/10 space-y-1">
          <div class="text-xs uppercase tracking-wider text-slate-400 font-medium">${escapeHtml(m.label)}</div>
          <div class="text-2xl font-bold text-white tracking-tight">${escapeHtml(m.value)}</div>
        </div>
      `
    )
    .join('\n');

  const highlightsHtml = (project.highlights || [])
    .map(
      (h) => `
        <li class="flex items-start space-x-3 text-slate-300">
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </span>
          <span class="text-sm leading-relaxed">${escapeHtml(h)}</span>
        </li>
      `
    )
    .join('\n');

  const techStackHtml = (project.techStack || [])
    .map(
      (t) => `
        <span class="px-3 py-1 text-xs font-medium text-slate-200 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/40 transition-colors">
          ${escapeHtml(t)}
        </span>
      `
    )
    .join('\n');

  let output = template
    .replace(/\{\{TITLE\}\}/g, escapeHtml(project.title))
    .replace(/\{\{TAGLINE\}\}/g, escapeHtml(project.tagline))
    .replace(/\{\{CATEGORY\}\}/g, escapeHtml(project.category))
    .replace(/\{\{STATUS\}\}/g, escapeHtml(project.status))
    .replace(/\{\{METRICS_HTML\}\}/g, metricsHtml)
    .replace(/\{\{DIAGRAM\}\}/g, project.diagram || 'graph TD; App-->Ready;')
    .replace(/\{\{HIGHLIGHTS_HTML\}\}/g, highlightsHtml)
    .replace(/\{\{TECH_STACK_HTML\}\}/g, techStackHtml)
    .replace(/\{\{REPO_PATH\}\}/g, escapeHtml(project.repoPath || 'Internal Workspace'));

  const rootOut = path.join(rootPagesDir, `${project.id}.html`);
  const srcOut = path.join(srcPagesDir, `${project.id}.html`);
  const distOut = path.join(distPagesDir, `${project.id}.html`);

  fs.writeFileSync(rootOut, output, 'utf8');
  fs.writeFileSync(srcOut, output, 'utf8');
  fs.writeFileSync(distOut, output, 'utf8');
  console.log(`✓ Generated landing page: pages/${project.id}.html`);
}

if (targetArg === '--all') {
  projects.forEach(generateProjectPage);
  console.log(`✨ All ${projects.length} project landing pages synchronized.`);
} else {
  const project = projects.find((p) => p.id === targetArg);
  if (!project) {
    console.error(`Error: Project "${targetArg}" not found in data/projects.json`);
    process.exit(1);
  }
  generateProjectPage(project);
}
