/**
 * Represents the complete structure of a user's resume.
 */
export interface Resume {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

/**
 * Personal contact information and professional summary.
 */
export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
}

/**
 * Noteworthy personal or professional project.
 */
export interface Project {
  id: string;
  name: string;
  role: string;
  stack: string;
  description: string;
  keywords: string;
  link: string;
}

/**
 * Professional work experience entry.
 */
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

/**
 * Academic education entry.
 */
export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
}

export const INITIAL_STATE: Resume = {
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
