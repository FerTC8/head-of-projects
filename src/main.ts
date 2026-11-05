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
  repoPath: string;
  status: string;
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
  timeline: string;
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
            <span class="text-xs uppercase tracking-wider text-blue-400 font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              ${p.category}
            </span>
            <span class="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
              ${p.status}
            </span>
          </div>

          <div>
            <h3 class="text-xl font-bold text-white tracking-tight">${p.title}</h3>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">${p.tagline}</p>
          </div>

          <!-- Métricas clave -->
          <div class="grid grid-cols-3 gap-2 py-2 border-y border-white/5">
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
        <div class="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
          <button data-id="${p.id}" class="open-diagram-btn apple-btn text-xs font-semibold px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center">
            <svg class="w-3.5 h-3.5 mr-1.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
            Arquitectura
          </button>
          <a href="./pages/${p.id}.html" class="apple-btn text-xs font-semibold px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center">
            Ver Proyecto
            <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    `
    )
    .join('');

  // Vincular eventos del modal de arquitectura
  document.querySelectorAll('.open-diagram-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
      const p = projects.find((item) => item.id === id);
      if (p) openDiagramModal(p);
    });
  });
}

// Renderizado de Servicios y Consultoría
function renderServices() {
  servicesGrid.innerHTML = services
    .map(
      (s) => `
      <div class="glass-panel card-hover rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              ${s.badge}
            </span>
            <span class="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              ${s.timeline}
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

// Formulario de Contacto
const inquiryForm = document.getElementById('inquiry-form') as HTMLFormElement;
const formSuccess = document.getElementById('form-success');

inquiryForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = (document.getElementById('form-name') as HTMLInputElement).value;
  const email = (document.getElementById('form-email') as HTMLInputElement).value;
  const details = (document.getElementById('form-details') as HTMLTextAreaElement).value;

  const subject = encodeURIComponent(`Consulta técnica / proyecto de ${name}`);
  const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nDetalles del proyecto:\n${details}`);

  if (formSuccess) {
    formSuccess.classList.remove('hidden');
  }
  window.location.href = `mailto:contact@3decibels.com?subject=${subject}&body=${body}`;
});

// Inicialización
renderProjects();
renderServices();
