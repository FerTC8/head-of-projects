import mermaid from 'mermaid';
import projectsData from '../data/projects.json';
import servicesData from '../data/services.json';

// Configuración de Mermaid para renderizado de diagramas
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#161922',
    primaryColor: '#0071e3',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: 'rgba(255, 255, 255, 0.15)',
    lineColor: '#60a5fa',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a'
  }
});

interface ProjectMetric {
  label: string;
  value: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  liveUrl?: string;
  githubUrl?: string;
  repoPath: string;
  status?: string;
  featured: boolean;
  metrics: ProjectMetric[];
  highlights: string[];
  techStack: string[];
  diagram: string;
}

interface Service {
  id: string;
  title: string;
  badge: string;
  timeline?: string;
  tagline: string;
  deliverables: string[];
  idealFor: string;
}

const projects: Project[] = projectsData as Project[];
const services: Service[] = servicesData as Service[];

// Elementos del DOM
const projectsGrid = document.getElementById('projects-grid')!;
const servicesGrid = document.getElementById('services-grid')!;

const modal = document.getElementById('diagram-modal')!;
const modalTitle = document.getElementById('modal-title')!;
const modalSubtitle = document.getElementById('modal-subtitle')!;
const modalDiagramContainer = document.getElementById('modal-diagram-container')!;
const modalPageLink = document.getElementById('modal-page-link') as HTMLAnchorElement;
const modalLiveLink = document.getElementById('modal-live-link') as HTMLAnchorElement;
const modalCloseBtn = document.getElementById('modal-close-btn')!;
const modalDoneBtn = document.getElementById('modal-done-btn')!;

// Renderizado de Proyectos
function renderProjects() {
  projectsGrid.innerHTML = projects
    .map(
      (p) => `
      <div class="glass-panel card-hover rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase tracking-widest text-slate-400 font-medium">
              ${p.category}
            </span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-white tracking-tight">${p.title}</h3>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">${p.tagline}</p>
          </div>

          <!-- Métricas clave -->
          <div class="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
            ${p.metrics
              .map(
                (m) => `
              <div class="text-center">
                <div class="text-[10px] text-slate-400 uppercase font-medium">${m.label}</div>
                <div class="text-xs font-bold text-white mt-0.5">${m.value}</div>
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
                ${t}
              </span>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
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
            <a href="./pages/${p.id}.html" class="apple-btn text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center shrink-0">
              Ver Ficha →
            </a>
          `}
        </div>
      </div>
    `
    )
    .join('');

}

// Renderizado de Servicios y Consultoría
function renderServices() {
  servicesGrid.innerHTML = services
    .map(
      (s) => `
      <div class="glass-panel card-hover rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              ${s.badge}
            </span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-white tracking-tight">${s.title}</h3>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">${s.tagline}</p>
          </div>

          <div class="space-y-2 pt-2">
            <div class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Alcance y entregables</div>
            <ul class="space-y-2">
              ${s.deliverables
                .map(
                  (d) => `
                <li class="flex items-start text-xs text-slate-300 space-x-2">
                  <span class="text-blue-400 font-bold shrink-0">✓</span>
                  <span>${d}</span>
                </li>
              `
                )
                .join('')}
            </ul>
          </div>
        </div>

        <div class="pt-4 border-t border-white/10 flex items-center justify-between">
          <div class="text-xs text-slate-400 italic">${s.idealFor}</div>
          <a href="#contacto" class="apple-btn text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 shrink-0 ml-3">
            Consultar
          </a>
        </div>
      </div>
    `
    )
    .join('');
}

// Modal de Diagrama
async function openDiagramModal(p: Project) {
  modalTitle.textContent = `${p.title} — Arquitectura del Sistema`;
  modalSubtitle.textContent = `Flujo de datos y arquitectura (${p.category})`;
  modalPageLink.href = `./pages/${p.id}.html`;

  if (modalLiveLink) {
    if (p.liveUrl) {
      modalLiveLink.href = p.liveUrl;
      modalLiveLink.classList.remove('hidden');
    } else {
      modalLiveLink.classList.add('hidden');
    }
  }

  modalDiagramContainer.innerHTML = `<pre class="mermaid text-center">${p.diagram}</pre>`;
  modal.classList.remove('hidden');

  try {
    await mermaid.run({
      nodes: [modalDiagramContainer.querySelector('.mermaid')!]
    });
  } catch (err) {
    console.error('Error al renderizar Mermaid', err);
  }
}

function closeDiagramModal() {
  modal.classList.add('hidden');
}

modalCloseBtn?.addEventListener('click', closeDiagramModal);
modalDoneBtn?.addEventListener('click', closeDiagramModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeDiagramModal();
});

// Inicialización
renderProjects();
renderServices();
