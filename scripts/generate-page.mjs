import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const projectsDataPath = path.join(rootDir, 'data', 'projects.json');
const servicesDataPath = path.join(rootDir, 'data', 'services.json');
const templatePath = path.join(rootDir, 'templates', 'landing-page.html');
const indexHtmlPath = path.join(rootDir, 'index.html');
const rootPagesDir = path.join(rootDir, 'pages');
const srcPagesDir = path.join(rootDir, 'src', 'pages');
const distPagesDir = path.join(rootDir, 'dist', 'pages');

[rootPagesDir, srcPagesDir, distPagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const projects = JSON.parse(fs.readFileSync(projectsDataPath, 'utf8'));
const services = JSON.parse(fs.readFileSync(servicesDataPath, 'utf8'));
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
  if (project.customPage) {
    const srcOut = path.join(srcPagesDir, `${project.id}.html`);
    if (fs.existsSync(srcOut)) {
      const customContent = fs.readFileSync(srcOut, 'utf8');
      const rootOut = path.join(rootPagesDir, `${project.id}.html`);
      const distOut = path.join(distPagesDir, `${project.id}.html`);
      fs.writeFileSync(rootOut, customContent, 'utf8');
      fs.writeFileSync(distOut, customContent, 'utf8');
      console.log(`✓ Synchronized custom landing page: pages/${project.id}.html`);
      return;
    }
  }

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

  const iframeSrc = project.mirrorUrl || project.liveUrl;
  let livePreviewHtml = '';
  if (project.previewType === 'image') {
    const rawImg = project.previewImage || project.image || './images/export-analysis.png';
    const pageImg = rawImg.startsWith('./') ? `.${rawImg}` : rawImg;
    livePreviewHtml = `
      <!-- Vista Previa del Producto (Captura Optimizada en Alta Resolución) -->
      <section class="glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-0 shadow-2xl">
        <div class="px-5 py-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-[#ff5f56]/80"></span>
            <span class="w-3 h-3 rounded-full bg-[#ffbd2e]/80"></span>
            <span class="w-3 h-3 rounded-full bg-[#27c93f]/80"></span>
            <span class="ml-3 text-xs text-slate-400 font-mono hidden sm:inline-flex items-center">
              <svg class="w-3.5 h-3.5 text-blue-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              ${escapeHtml(project.title)} — Looker Studio
            </span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="inline-flex items-center text-[11px] text-slate-400 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"></span>
              Captura Oficial de Producción
            </span>
            ${project.liveUrl ? `
              <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="apple-btn text-xs font-semibold px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center">
                Abrir en Looker Studio ↗
              </a>
            ` : ''}
          </div>
        </div>
        <div class="relative w-full bg-[#0a0c12] p-4 sm:p-6 md:p-8 flex items-center justify-center overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
          <div class="relative max-w-5xl w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 ring-1 ring-white/5">
            <a href="${escapeHtml(pageImg)}" target="_blank" rel="noopener noreferrer" class="block group cursor-zoom-in" title="Clic para ampliar en alta resolución">
              <img src="${escapeHtml(pageImg)}" alt="${escapeHtml(project.title)}" class="w-full h-auto block select-none group-hover:scale-[1.008] transition-transform duration-300" loading="eager">
            </a>
          </div>
        </div>
      </section>
    `;
  } else if (project.liveUrl || project.mirrorUrl) {
    livePreviewHtml = `
      <!-- Vista Previa Interactiva en Vivo (Iframe) -->
      <section class="glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-0">
        <div class="px-5 py-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-[#ff5f56]/80"></span>
            <span class="w-3 h-3 rounded-full bg-[#ffbd2e]/80"></span>
            <span class="w-3 h-3 rounded-full bg-[#27c93f]/80"></span>
            <span class="ml-3 text-xs text-slate-400 font-mono hidden sm:inline-flex items-center">
              <svg class="w-3 h-3 text-emerald-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
              ${escapeHtml(project.liveUrl || project.mirrorUrl)}
            </span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="inline-flex items-center text-[11px] text-emerald-400 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Showcase en Vivo
            </span>
            <a href="${project.liveUrl || project.mirrorUrl}" target="_blank" rel="noopener noreferrer" class="apple-btn text-xs font-semibold px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center">
              Abrir en ventana nueva ↗
            </a>
          </div>
        </div>
        <div class="relative w-full h-[700px] bg-[#0c0e14]">
          <iframe src="${iframeSrc}" class="w-full h-full border-0" loading="lazy" title="${escapeHtml(project.title)}"></iframe>
        </div>
      </section>
    `;
  }

  const linksHtml = `
    ${project.liveUrl ? `
      <div class="space-y-1">
        <div class="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Demo Público en Vivo</div>
        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-400 hover:underline break-all block font-mono">
          ${escapeHtml(project.liveUrl)}
        </a>
      </div>
    ` : ''}
    ${project.githubUrl ? `
      <div class="space-y-1">
        <div class="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Código en GitHub</div>
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="text-xs text-blue-400 hover:underline break-all block font-mono">
          ${escapeHtml(project.githubUrl)}
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
    .replace(/\{\{METRICS_GRID_CLASS\}\}/g, (project.metrics || []).length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3')
    .replace(/\{\{METRICS_HTML\}\}/g, metricsHtml)
    .replace(/\{\{DIAGRAM\}\}/g, project.diagram || 'graph TD; App-->Ready;')
    .replace(/\{\{HIGHLIGHTS_HTML\}\}/g, highlightsHtml)
    .replace(/\{\{TECH_STACK_HTML\}\}/g, techStackHtml)
    .replace(/\{\{HEADER_ACTIONS_HTML\}\}/g, headerActionsHtml)
    .replace(/\{\{HERO_ACTIONS_HTML\}\}/g, heroActionsHtml)
    .replace(/\{\{LIVE_PREVIEW_HTML\}\}/g, livePreviewHtml)
    .replace(/\{\{LINKS_HTML\}\}/g, linksHtml);

  const rootOut = path.join(rootPagesDir, `${project.id}.html`);
  const srcOut = path.join(srcPagesDir, `${project.id}.html`);
  const distOut = path.join(distPagesDir, `${project.id}.html`);

  fs.writeFileSync(rootOut, output, 'utf8');
  fs.writeFileSync(srcOut, output, 'utf8');
  fs.writeFileSync(distOut, output, 'utf8');
  console.log(`✓ Generated landing page: pages/${project.id}.html`);
}

function preRenderIndex() {
  if (!fs.existsSync(indexHtmlPath)) return;
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Pre-render projects grid
  const projectsGridHtml = projects
    .map(
      (p, index) => {
        let colClasses = 'col-span-1 md:col-span-1 lg:col-span-2';
        if (projects.length === 5) {
          if (index === 3) {
            colClasses = 'col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-2';
          } else if (index === 4) {
            colClasses = 'col-span-1 md:col-span-2 md:max-w-md md:mx-auto md:w-full lg:col-start-4 lg:col-span-2 lg:max-w-none lg:mx-0';
          }
        }
        return `
      <div class="glass-panel card-hover rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6 ${colClasses}">
        ${p.image ? `<div class="card-ambient-bg" style="background-image: url('${escapeHtml(p.image)}');"></div>` : ''}
        <div class="space-y-4 relative z-10">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase tracking-widest text-slate-400 font-medium">
              ${escapeHtml(p.category)}
            </span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-white tracking-tight">${escapeHtml(p.title)}</h3>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">${escapeHtml(p.tagline)}</p>
          </div>

          <!-- Métricas clave -->
          <div class="grid ${(p.metrics || []).length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-2 py-3 border-y border-white/5">
            ${p.metrics
              .map(
                (m) => `
              <div class="text-center">
                <div class="text-[10px] text-slate-400 uppercase tracking-wider font-medium">${escapeHtml(m.label)}</div>
                <div class="text-xs font-semibold text-white mt-0.5">${escapeHtml(m.value)}</div>
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Etiquetas de tecnologías -->
          <div class="flex flex-wrap gap-1.5">
            ${p.techStack
              .map(
                (t) => `
              <span class="px-2 py-0.5 text-[11px] font-medium text-slate-300 bg-white/5 rounded border border-white/5">
                ${escapeHtml(t)}
              </span>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div class="flex items-center gap-1.5">
            <a href="./pages/${p.id}.html" class="apple-btn text-xs font-medium px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center">
              Ficha
            </a>
            ${p.githubUrl ? `
              <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="apple-btn text-xs p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 flex items-center" title="Repositorio en GitHub">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            ` : ''}
          </div>

          ${p.liveUrl ? `
            <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="apple-btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center shrink-0">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Demo en Vivo
              <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          ` : `
            <a href="./pages/${p.id}.html" class="apple-btn text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center shrink-0">
              Ver Proyecto →
            </a>
          `}
        </div>
      </div>
    `;
      }
    )
    .join('\n');

  // Pre-render services grid
  const servicesGridHtml = services
    .map(
      (s) => `
      <div class="glass-panel card-hover rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              ${escapeHtml(s.badge)}
            </span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-white tracking-tight">${escapeHtml(s.title)}</h3>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">${escapeHtml(s.tagline)}</p>
          </div>

          <div class="space-y-2 pt-2">
            <div class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Alcance y entregables</div>
            <ul class="space-y-2">
              ${s.deliverables
                .map(
                  (d) => `
                <li class="flex items-start text-xs text-slate-300 space-x-2">
                  <span class="text-blue-400 font-bold shrink-0">✓</span>
                  <span>${escapeHtml(d)}</span>
                </li>
              `
                )
                .join('')}
            </ul>
          </div>
        </div>

        <div class="pt-4 border-t border-white/10 flex items-center justify-between">
          <div class="text-xs text-slate-400 italic">${escapeHtml(s.idealFor)}</div>
          <a href="#contacto" class="apple-btn text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 shrink-0 ml-3">
            Consultar
          </a>
        </div>
      </div>
    `
    )
    .join('\n');

  indexHtml = indexHtml.replace(
    /<!-- PROJECTS_GRID_START -->[\s\S]*?<!-- PROJECTS_GRID_END -->/,
    `<!-- PROJECTS_GRID_START -->\n${projectsGridHtml}\n      <!-- PROJECTS_GRID_END -->`
  );

  indexHtml = indexHtml.replace(
    /<!-- SERVICES_GRID_START -->[\s\S]*?<!-- SERVICES_GRID_END -->/,
    `<!-- SERVICES_GRID_START -->\n${servicesGridHtml}\n      <!-- SERVICES_GRID_END -->`
  );

  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  const distIndexPath = path.join(rootDir, 'dist', 'index.html');
  if (fs.existsSync(distIndexPath)) {
    let distHtml = fs.readFileSync(distIndexPath, 'utf8');
    distHtml = distHtml.replace(
      /<!-- PROJECTS_GRID_START -->[\s\S]*?<!-- PROJECTS_GRID_END -->/,
      `<!-- PROJECTS_GRID_START -->\n${projectsGridHtml}\n      <!-- PROJECTS_GRID_END -->`
    );
    distHtml = distHtml.replace(
      /<!-- SERVICES_GRID_START -->[\s\S]*?<!-- SERVICES_GRID_END -->/,
      `<!-- SERVICES_GRID_START -->\n${servicesGridHtml}\n      <!-- SERVICES_GRID_END -->`
    );
    fs.writeFileSync(distIndexPath, distHtml, 'utf8');
  }
  console.log(`✓ Pre-rendered projects and services into index.html and dist/index.html`);
}

if (targetArg === '--all') {
  projects.forEach(generateProjectPage);
  preRenderIndex();
  console.log(`✨ All ${projects.length} project landing pages synchronized.`);
} else {
  const project = projects.find((p) => p.id === targetArg);
  if (!project) {
    console.error(`Error: Project "${targetArg}" not found in data/projects.json`);
    process.exit(1);
  }
  generateProjectPage(project);
  preRenderIndex();
}
