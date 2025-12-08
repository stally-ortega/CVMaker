import { Component, Injectable, signal, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// --- INTERFACES ---

export interface Resume {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  stack: string;
  description: string;
  keywords: string;
  link: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  duties: string; 
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
}

const INITIAL_STATE: Resume = {
  profile: {
    fullName: 'Juan J. Desarrollador',
    email: 'hola@ejemplo.com',
    phone: '+34 600 000 000',
    location: 'Madrid, España',
    linkedin: 'linkedin.com/in/juanjdev',
    github: 'github.com/juanjdev',
    summary: 'Arquitecto de Software Senior especializado en Angular y Clean Code. Apasionado por construir aplicaciones web escalables con tecnologías modernas.'
  },
  experience: [
    {
      id: '1',
      role: 'Desarrollador Angular Senior',
      company: 'Tech Solutions Inc.',
      location: 'Madrid',
      startDate: '2022-01',
      endDate: 'Presente',
      current: true,
      duties: 'Lideré la migración de un monolito legacy a micro-frontends.\nImplementé gestión de estado usando Signals.\nMentoricé a desarrolladores junior.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Grado en Ingeniería Informática',
      institution: 'Universidad Politécnica',
      location: 'Madrid',
      graduationDate: '2018'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'Sistema de Predicción con IA (Stacking)',
      role: 'Desarrollador ML',
      stack: 'Python, LSTM, XGBoost',
      description: 'Colaboré en el desarrollo de una arquitectura de modelos híbrida (Stacking) para mejorar la precisión predictiva.\nImplementé el reentrenamiento y optimización de un modelo meta-learner para unificar las salidas de redes LSTM y algoritmos XGBoost.',
      keywords: 'Machine Learning, Model Tuning, Data Analysis, Python',
      link: 'github.com/juanjdev/ai-stacking'
    },
    {
      id: '2',
      name: 'Automatización de Workflows Corporativos',
      role: 'Ingeniero de Automatización',
      stack: 'n8n, Active Directory, PostgreSQL',
      description: 'Diseñé y desplegué un flujo de trabajo complejo en n8n para la gestión automática de usuarios.\nIntegré servicios de Active Directory con bases de datos PostgreSQL para sincronizar altas y bajas de empleados, reduciendo la carga manual operativa.',
      keywords: 'Workflow Automation, Backend Integration, Scripting',
      link: ''
    }
  ],
  skills: ['Angular', 'TypeScript', 'Tailwind CSS', 'RxJS', 'Node.js', 'Clean Architecture']
};

// --- SERVICE ---

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private _resume = signal<Resume>(this.loadFromStorage());

  resume = this._resume.asReadonly();
  profile = computed(() => this.resume().profile);
  experience = computed(() => this.resume().experience);
  education = computed(() => this.resume().education);
  projects = computed(() => this.resume().projects);
  skills = computed(() => this.resume().skills);

  constructor() {
    console.log('ResumeService initialized');
    effect(() => {
      try {
        const data = this._resume();
        localStorage.setItem('ats_resume_data', JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save resume data', e);
      }
    });
  }

  private loadFromStorage(): Resume {
    try {
      const stored = localStorage.getItem('ats_resume_data');
      return stored ? JSON.parse(stored) : INITIAL_STATE;
    } catch (e) {
      console.error('Failed to load resume data', e);
      return INITIAL_STATE;
    }
  }

  loadState(state: Resume) {
    this._resume.set(state);
  }

  updateProfile(profile: Partial<Profile>) {
    this._resume.update(current => ({
      ...current,
      profile: { ...current.profile, ...profile }
    }));
  }

  addExperience(exp: Experience) {
    this._resume.update(current => ({
      ...current,
      experience: [...current.experience, exp]
    }));
  }

  updateExperience(id: string, exp: Partial<Experience>) {
    this._resume.update(current => ({
      ...current,
      experience: current.experience.map(e => e.id === id ? { ...e, ...exp } : e)
    }));
  }

  removeExperience(id: string) {
    this._resume.update(current => ({
      ...current,
      experience: current.experience.filter(e => e.id !== id)
    }));
  }

  addEducation(edu: Education) {
    this._resume.update(current => ({
      ...current,
      education: [...current.education, edu]
    }));
  }

  updateEducation(id: string, edu: Partial<Education>) {
    this._resume.update(current => ({
      ...current,
      education: current.education.map(e => e.id === id ? { ...e, ...edu } : e)
    }));
  }

  removeEducation(id: string) {
    this._resume.update(current => ({
      ...current,
      education: current.education.filter(e => e.id !== id)
    }));
  }

  addProject(proj: Project) {
    this._resume.update(current => ({
      ...current,
      projects: [...(current.projects || []), proj]
    }));
  }

  updateProject(id: string, proj: Partial<Project>) {
    this._resume.update(current => ({
      ...current,
      projects: (current.projects || []).map(p => p.id === id ? { ...p, ...proj } : p)
    }));
  }

  removeProject(id: string) {
    this._resume.update(current => ({
      ...current,
      projects: (current.projects || []).filter(p => p.id !== id)
    }));
  }

  updateSkills(skills: string[]) {
    this._resume.update(current => ({
      ...current,
      skills
    }));
  }
}

// --- PREVIEW COMPONENT ---

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="print-area" class="a4-page bg-white text-gray-900 font-sans text-sm leading-normal shadow-lg mx-auto overflow-hidden flex flex-col justify-between gap-5">
      <!-- Header -->
      <div class="border-b-2 border-gray-800 pb-4">
        <h1 class="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2">{{ resume().profile.fullName }}</h1>
        <div class="contact-line flex flex-wrap gap-x-4 text-gray-700 text-xs">
          <span *ngIf="resume().profile.location" class="flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
             {{ resume().profile.location }}
          </span>
          <span *ngIf="resume().profile.email" class="flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
             {{ resume().profile.email }}
          </span>
          <span *ngIf="resume().profile.phone" class="flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 1.25 0 2.45.2 3.57.57.35.11.74.03 1.02-.24l2.2-2.2z"/></svg>
             {{ resume().profile.phone }}
          </span>
          <span *ngIf="resume().profile.linkedin" class="flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
             <a [href]="getUrl(resume().profile.linkedin)" class="text-blue-700 hover:underline">LinkedIn</a>
          </span>
          <span *ngIf="resume().profile.github" class="flex items-center gap-1">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 7.56 9.75.5.08.68-.22.68-.48v-1.74c-2.79.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.18.57.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></svg>
             <a [href]="getUrl(resume().profile.github)" class="text-blue-700 hover:underline">GitHub</a>
          </span>
        </div>
      </div>

      <!-- Summary -->
      <div *ngIf="resume().profile.summary">
        <h2 class="section-title">Perfil Profesional</h2>
        <p class="text-gray-700 whitespace-pre-line">{{ resume().profile.summary }}</p>
      </div>

      <!-- Experience -->
      <div *ngIf="resume().experience.length">
        <h2 class="section-title">Experiencia Laboral</h2>
        <div *ngFor="let job of resume().experience" class="mb-4 break-inside-avoid">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="font-bold text-gray-800 text-base">
                {{ job.role }} <span class="text-gray-400 mx-1">|</span> <span class="font-semibold text-gray-700">{{ job.company }}</span>
            </h3>
            <span class="text-gray-600 text-xs font-semibold whitespace-nowrap">{{ job.startDate }} - {{ job.current ? 'Presente' : job.endDate }}</span>
          </div>
          <div class="mb-2">
             <span class="text-gray-500 text-xs italic">{{ job.location }}</span>
          </div>
          <ul class="list-disc list-inside text-gray-700 space-y-0.5 ml-1">
            <li *ngFor="let duty of splitLines(job.duties)">{{ duty }}</li>
          </ul>
        </div>
      </div>

      <!-- Projects (NEW) -->
      <div *ngIf="resume().projects.length">
        <h2 class="section-title">Proyectos Destacados</h2>
        <div *ngFor="let proj of resume().projects" class="mb-4 break-inside-avoid">
            <div class="mb-1 border-l-2 border-gray-300 pl-2">
                <div class="flex flex-wrap items-baseline gap-2">
                    <h3 class="font-bold text-gray-800 text-base">{{ proj.name }}</h3>
                    <span class="text-gray-400">|</span>
                    <span class="font-semibold text-gray-700 text-sm">{{ proj.role }}</span>
                    <span class="text-gray-400">|</span>
                    <span class="text-gray-600 text-sm italic">{{ proj.stack }}</span>
                </div>
                 <a *ngIf="proj.link" [href]="getUrl(proj.link)" class="text-xs text-blue-600 hover:underline block mb-1">Ver Proyecto</a>
            </div>
            
            <p class="text-gray-700 whitespace-pre-line mb-1 pl-2">{{ proj.description }}</p>
            
            <div *ngIf="proj.keywords" class="pl-2 mt-1">
                <span class="text-xs font-bold text-gray-600">Keywords: </span>
                <span class="text-xs text-gray-600 italic">{{ proj.keywords }}</span>
            </div>
        </div>
      </div>

      <!-- Education -->
      <div *ngIf="resume().education.length">
        <h2 class="section-title">Educación</h2>
        <div *ngFor="let edu of resume().education" class="mb-3 break-inside-avoid">
          <div class="flex justify-between items-baseline">
            <h3 class="font-bold text-gray-800">{{ edu.institution }}</h3>
            <span class="text-gray-600 text-xs font-semibold">{{ edu.graduationDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-700">{{ edu.degree }}</span>
            <span class="text-gray-500 text-xs">{{ edu.location }}</span>
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div *ngIf="resume().skills.length">
        <h2 class="section-title">Habilidades Técnicas</h2>
        <div class="flex flex-wrap gap-2 text-gray-700">
             <span *ngFor="let skill of resume().skills; let last = last">{{ skill }}<span *ngIf="!last" class="text-gray-400"> | </span></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .a4-page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm 20mm;
      box-sizing: border-box;
    }
    .section-title {
      @apply text-lg font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-300 pb-1;
    }
    svg { display: inline-block; vertical-align: text-bottom; }
  `]
})
export class PreviewComponent {
  resumeService = inject(ResumeService);
  resume = this.resumeService.resume;

  splitLines(text: string): string[] {
    return text.split('\\n').filter(d => d.trim().length > 0);
  }

  getUrl(link: string): string {
    if (!link) return '';
    return link.startsWith('http') ? link : 'https://' + link;
  }
}

// --- EDITOR COMPONENT ---

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-gray-50 h-full overflow-y-auto p-6 shadow-inner">
      <div class="flex justify-between items-center mb-6 gap-2">
        <h2 class="text-2xl font-bold text-gray-800">Editor de CV</h2>
        <div class="flex gap-2">
            <input type="file" #fileInput (change)="importData($event)" class="hidden" accept=".json">
            <button (click)="fileInput.click()" class="bg-green-600 text-white px-3 py-2 rounded shadow hover:bg-green-700 font-semibold text-xs flex items-center gap-1" title="Cargar JSON">
                <span>📂 Importar</span>
            </button>
            <button (click)="exportData()" class="bg-gray-600 text-white px-3 py-2 rounded shadow hover:bg-gray-700 font-semibold text-xs flex items-center gap-1" title="Guardar JSON">
                <span>💾 Guardar</span>
            </button>
            <button (click)="exportPdf()" class="bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700 font-semibold text-xs flex items-center gap-1" title="Descargar PDF">
                <span>📄 PDF</span>
            </button>
        </div>
      </div>

      <div class="space-y-4" [formGroup]="form">
        
        <!-- Profile Section -->
        <div class="section-box">
          <button (click)="toggle('profile')" class="section-header">
            <span>Información Personal</span>
            <span class="transform transition-transform" [class.rotate-180]="openSection === 'profile'">▼</span>
          </button>
          
          <div *ngIf="openSection === 'profile'" class="p-4 space-y-4" formGroupName="profile">
            <div class="grid grid-cols-2 gap-4">
              <label class="form-label">
                Nombre Completo
                <input formControlName="fullName" class="form-input" placeholder="Juan Pérez">
              </label>
              <label class="form-label">
                Resumen Profesional
                <span class="text-xs font-normal text-gray-500">(Aparece destacado)</span>
              </label>
            </div>
             <div class="grid grid-cols-2 gap-4">
              <label class="form-label">Email <input formControlName="email" class="form-input"></label>
              <label class="form-label">Teléfono <input formControlName="phone" class="form-input"></label>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <label class="form-label">Ubicación <input formControlName="location" class="form-input"></label>
              <label class="form-label">LinkedIn (URL) <input formControlName="linkedin" class="form-input"></label>
            </div>
            <div class="grid grid-cols-2 gap-4">
               <label class="form-label">GitHub (URL) <input formControlName="github" class="form-input"></label>
            </div>
            <label class="form-label">
              Extracto / Perfil (Summary)
              <textarea formControlName="summary" rows="4" class="form-input" placeholder="Breve descripción de tu perfil..."></textarea>
            </label>
          </div>
        </div>

        <!-- Experience Section -->
        <div class="section-box">
           <button (click)="toggle('experience')" class="section-header">
            <span>Experiencia Laboral</span>
            <button type="button" (click)="addExperience($event)" class="text-blue-600 text-sm hover:underline">+ Añadir</button>
          </button>
          
          <div *ngIf="openSection === 'experience'" class="p-4 space-y-6" formArrayName="experience">
            <div *ngFor="let exp of experienceControls.controls; let i = index" [formGroupName]="i" class="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 text-sm">
                <div class="flex justify-end mb-2">
                    <button type="button" (click)="removeExperience(i)" class="text-red-500 text-xs hover:underline">Eliminar</button>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <input formControlName="role" placeholder="Cargo / Rol" class="form-input font-bold">
                  <input formControlName="company" placeholder="Empresa" class="form-input">
                </div>
                 <div class="grid grid-cols-2 gap-3 mb-3">
                  <div class="flex gap-2">
                     <input formControlName="startDate" type="text" placeholder="Inicio (AAAA-MM)" class="form-input">
                     <input formControlName="endDate" type="text" placeholder="Fin" class="form-input">
                  </div>
                   <input formControlName="location" placeholder="Ubicación" class="form-input">
                </div>
                 <label class="flex items-center gap-2 mb-3 text-gray-600">
                    <input type="checkbox" formControlName="current" class="form-checkbox"> Trabajo aquí actualmente
                 </label>
                <textarea formControlName="duties" rows="3" placeholder="Responsabilidades (Usa saltos de línea para bullets)" class="form-input"></textarea>
            </div>
          </div>
        </div>

        <!-- Projects Section (NEW) -->
        <div class="section-box">
           <button (click)="toggle('projects')" class="section-header">
            <span>Proyectos Destacados</span>
            <button type="button" (click)="addProject($event)" class="text-blue-600 text-sm hover:underline">+ Añadir</button>
          </button>
          
          <div *ngIf="openSection === 'projects'" class="p-4 space-y-6" formArrayName="projects">
            <div *ngFor="let proj of projectsControls.controls; let i = index" [formGroupName]="i" class="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 text-sm">
                <div class="flex justify-end mb-2">
                    <button type="button" (click)="removeProject(i)" class="text-red-500 text-xs hover:underline">Eliminar</button>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <input formControlName="name" placeholder="Nombre del Proyecto" class="form-input font-bold">
                  <input formControlName="role" placeholder="Tu Rol" class="form-input">
                </div>
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <input formControlName="stack" placeholder="Tech Stack (n8n, Python...)" class="form-input">
                  <input formControlName="link" placeholder="Enlace (GitHub/Demo)" class="form-input">
                </div>
                <div class="mb-3">
                    <textarea formControlName="description" rows="3" placeholder="Descripción de lo que hiciste..." class="form-input"></textarea>
                </div>
                <div>
                     <input formControlName="keywords" placeholder="Keywords (para ATS): Automation, Backend..." class="form-input">
                </div>
            </div>
          </div>
        </div>

        <!-- Education Section -->
        <div class="section-box">
           <button (click)="toggle('education')" class="section-header">
            <span>Educación</span>
            <button type="button" (click)="addEducation($event)" class="text-blue-600 text-sm hover:underline">+ Añadir</button>
          </button>
          
          <div *ngIf="openSection === 'education'" class="p-4 space-y-6" formArrayName="education">
            <div *ngFor="let edu of educationControls.controls; let i = index" [formGroupName]="i" class="border-l-4 border-purple-500 pl-4 py-2 bg-gray-50 text-sm">
                <div class="flex justify-end mb-2">
                    <button type="button" (click)="removeEducation(i)" class="text-red-500 text-xs hover:underline">Eliminar</button>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <input formControlName="degree" placeholder="Título / Grado" class="form-input font-bold">
                  <input formControlName="institution" placeholder="Institución" class="form-input">
                </div>
                 <div class="grid grid-cols-2 gap-3 mb-3">
                     <input formControlName="graduationDate" type="text" placeholder="Año Graduación" class="form-input">
                     <input formControlName="location" placeholder="Ubicación" class="form-input">
                </div>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div class="section-box">
          <button (click)="toggle('skills')" class="section-header">
            <span>Habilidades (Skills)</span>
             <span class="text-xs text-gray-500 font-normal ml-2">(Separadas por comas)</span>
          </button>
          <div *ngIf="openSection === 'skills'" class="p-4">
              <textarea [formControl]="skillsControl" (blur)="updateSkills()" class="form-input" rows="4" placeholder="Angular, TypeScript, Tailwind CSS..."></textarea>
          </div>
        </div>
      </div>
      
      <!-- Help Section -->
      <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
        <h3 class="font-bold mb-2">Consejos Anti-Filtros (ATS)</h3>
        <ul class="list-disc list-inside space-y-1">
            <li><strong>Columna Única:</strong> Los robots leen de arriba a abajo. Evita columnas laterales.</li>
            <li><strong>Fuentes Estándar:</strong> Sans-serif como Arial/Helvetica son las más seguras.</li>
            <li><strong>Stack Explícito:</strong> Pon "PostgreSQL" junto al título del proyecto para matar dos pájaros de un tiro.</li>
            <li><strong>Keywords:</strong> Usa términos de la descripción del trabajo en tu resumen y skills.</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .section-box { @apply bg-white rounded border border-gray-200 overflow-hidden shadow-sm; }
    .section-header { @apply w-full flex justify-between items-center p-4 bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 text-left; }
    .form-label { @apply block text-sm font-medium text-gray-700 mb-1; }
    .form-input { @apply w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border; }
  `]
})
export class EditorComponent {
  resumeService = inject(ResumeService);
  fb = inject(FormBuilder);
  
  form!: FormGroup;
  skillsControl = this.fb.control('');
  openSection = 'profile';

  constructor() {
    this.initForm(this.resumeService.resume());
  }

  initForm(data: Resume) {
    this.form = this.fb.group({
      profile: this.fb.group({
        fullName: [data.profile.fullName, Validators.required],
        email: [data.profile.email, [Validators.required, Validators.email]],
        phone: [data.profile.phone],
        location: [data.profile.location],
        linkedin: [data.profile.linkedin],
        github: [data.profile.github],
        summary: [data.profile.summary]
      }),
      experience: this.fb.array(data.experience.map(e => this.createExperienceGroup(e))),
      education: this.fb.array(data.education.map(e => this.createEducationGroup(e))),
      projects: this.fb.array(data.projects?.map(p => this.createProjectGroup(p)) || [])
    });

    this.skillsControl.setValue(data.skills.join(', '));

    // Simple auto-save
    this.form.get('profile')?.valueChanges.subscribe(p => this.resumeService.updateProfile(p));
  }

  exportData() {
    const data = this.resumeService.resume();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  importData(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          // Basic validation could go here
          this.resumeService.loadState(json);
          this.initForm(json);
          alert('Datos cargados correctamente.');
        } catch (error) {
          console.error('Error parsing JSON', error);
          alert('Error al cargar el archivo. Asegúrate de que es un JSON válido.');
        }
      };
      reader.readAsText(file);
    }
  }

  // --- GETTERS ---
  get experienceControls() { return this.form.get('experience') as FormArray; }
  get educationControls() { return this.form.get('education') as FormArray; }
  get projectsControls() { return this.form.get('projects') as FormArray; }

  // --- EXPERIENCE ---
  createExperienceGroup(e: Experience) {
    const g = this.fb.group({
      id: [e.id],
      role: [e.role, Validators.required],
      company: [e.company, Validators.required],
      location: [e.location],
      startDate: [e.startDate],
      endDate: [e.endDate],
      current: [e.current],
      duties: [e.duties]
    });
    g.valueChanges.subscribe(val => { if (val.id) this.resumeService.updateExperience(val.id, val as any); });
    return g;
  }

  addExperience(e: Event) {
    e.stopPropagation();
    const newExp: Experience = {
        id: crypto.randomUUID(),
        role: 'Nuevo Rol',
        company: 'Empresa',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        duties: ''
    };
    this.resumeService.addExperience(newExp);
    this.experienceControls.push(this.createExperienceGroup(newExp));
    this.openSection = 'experience';
  }

  removeExperience(index: number) {
     const id = this.experienceControls.at(index).get('id')?.value;
     this.resumeService.removeExperience(id);
     this.experienceControls.removeAt(index);
  }

  // --- EDUCATION ---
  createEducationGroup(e: Education) {
    const g = this.fb.group({
      id: [e.id],
      degree: [e.degree, Validators.required],
      institution: [e.institution, Validators.required],
      location: [e.location],
      graduationDate: [e.graduationDate]
    });
    g.valueChanges.subscribe(val => { if (val.id) this.resumeService.updateEducation(val.id, val as any); });
    return g;
  }

  addEducation(e: Event) {
    e.stopPropagation();
    const newEdu: Education = {
      id: crypto.randomUUID(),
      degree: 'Título',
      institution: 'Centro Educativo',
      location: '',
      graduationDate: ''
    };
    this.resumeService.addEducation(newEdu);
    this.educationControls.push(this.createEducationGroup(newEdu));
    this.openSection = 'education';
  }

  removeEducation(index: number) {
    const id = this.educationControls.at(index).get('id')?.value;
    this.resumeService.removeEducation(id);
    this.educationControls.removeAt(index);
  }

  // --- PROJECTS ---
  createProjectGroup(p: Project) {
    const g = this.fb.group({
      id: [p.id],
      name: [p.name, Validators.required],
      role: [p.role],
      stack: [p.stack],
      description: [p.description],
      keywords: [p.keywords],
      link: [p.link]
    });
    g.valueChanges.subscribe(val => { if (val.id) this.resumeService.updateProject(val.id, val as any); });
    return g;
  }

  addProject(e: Event) {
    e.stopPropagation();
    const newProj: Project = {
        id: crypto.randomUUID(),
        name: 'Nuevo Proyecto',
        role: 'Rol',
        stack: 'Tech Stack',
        description: '',
        keywords: '',
        link: ''
    };
    this.resumeService.addProject(newProj);
    this.projectsControls.push(this.createProjectGroup(newProj));
    this.openSection = 'projects';
  }

  removeProject(index: number) {
    const id = this.projectsControls.at(index).get('id')?.value;
    this.resumeService.removeProject(id);
    this.projectsControls.removeAt(index);
  }

  // --- SKILLS & UTILS ---
  updateSkills() {
    const raw = this.skillsControl.value || '';
    const skills = raw.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    this.resumeService.updateSkills(skills);
  }

  toggle(section: string) {
    this.openSection = this.openSection === section ? '' : section;
  }

  exportPdf() {
    window.print();
  }
}

// --- APP ROOT COMPONENT ---

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EditorComponent, PreviewComponent],
  template: `
    <div class="flex h-screen w-full bg-gray-100 overflow-hidden main-layout">
      <!-- Left Panel: Editor -->
      <aside class="w-1/3 min-w-[350px] max-w-[500px] border-r border-gray-300 z-10 relative">
        <app-editor></app-editor>
      </aside>

      <!-- Right Panel: Preview -->
      <main class="flex-1 bg-gray-200 overflow-y-auto p-8 flex justify-center items-start">
        <app-preview class="shadow-2xl"></app-preview>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class AppComponent implements OnInit {
  title = 'ats-cv-builder';
  
  ngOnInit() {
    console.log('AppComponent initialized');
  }
}
