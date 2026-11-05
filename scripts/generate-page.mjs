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

  const headerActionsHtml = project.liveUrl
    ? `
      <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="apple-btn text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg shadow-sm flex items-center">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 mr-1.5 animate-pulse"></span>
        Ver Demo en Vivo ↗
      </a>
      <a href="../index.html#contacto" class="apple-btn text-xs font-semibold bg-white/10 hover:bg-white/15 text-white px-3 py-1.5 rounded-lg border border-white/10">
        Contactar
      </a>
    `
    : `
      <a href="../index.html#contacto" class="apple-btn text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg shadow-sm">
        Contactar
      </a>
    `;

  const heroActionsHtml = (project.liveUrl || project.githubUrl)
    ? `
      <div class="flex flex-wrap items-center gap-3 pt-2">
        ${project.liveUrl ? `
          <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="apple-btn inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30">
            <span class="w-2 h-2 rounded-full bg-emerald-300 mr-2 animate-pulse"></span>
            Ver Demo en Vivo
            <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        ` : ''}
        ${project.githubUrl ? `
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="apple-btn inline-flex items-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Repositorio Público
          </a>
        ` : ''}
      </div>
    `
    : '';

  const linksHtml = `
    ${project.liveUrl ? `
      <div class="space-y-1">
        <div class="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Demo Público en Vivo</div>
        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-400 hover:underline break-all block font-mono">
          ${project.liveUrl}
        </a>
      </div>
    ` : ''}
    ${project.githubUrl ? `
      <div class="space-y-1">
        <div class="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Código en GitHub</div>
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-400 hover:underline break-all block font-mono">
          ${project.githubUrl}
        </a>
      </div>
    ` : ''}
    <div class="space-y-1">
      <div class="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Proyecto Interno</div>
      <div class="text-xs font-mono text-slate-300 bg-black/40 px-3 py-2 rounded-lg border border-white/5 truncate">
        ${escapeHtml(project.repoPath || 'Internal Workspace')}
      </div>
    </div>
  `;

  let output = template
    .replace(/\{\{TITLE\}\}/g, escapeHtml(project.title))
    .replace(/\{\{TAGLINE\}\}/g, escapeHtml(project.tagline))
    .replace(/\{\{CATEGORY\}\}/g, escapeHtml(project.category))
    .replace(/\{\{STATUS\}\}/g, escapeHtml(project.status))
    .replace(/\{\{METRICS_HTML\}\}/g, metricsHtml)
    .replace(/\{\{DIAGRAM\}\}/g, project.diagram || 'graph TD; App-->Ready;')
    .replace(/\{\{HIGHLIGHTS_HTML\}\}/g, highlightsHtml)
    .replace(/\{\{TECH_STACK_HTML\}\}/g, techStackHtml)
    .replace(/\{\{HEADER_ACTIONS_HTML\}\}/g, headerActionsHtml)
    .replace(/\{\{HERO_ACTIONS_HTML\}\}/g, heroActionsHtml)
    .replace(/\{\{LINKS_HTML\}\}/g, linksHtml);

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
