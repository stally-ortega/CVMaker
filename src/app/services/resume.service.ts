import { Injectable, signal, computed, effect } from '@angular/core';
import { Resume, Profile, Experience, Education, Project, INITIAL_STATE } from '../models/resume.models';

/**
 * Service to manage the global state of the Resume.
 * 
 * Uses Angular Signals for reactive state management and automatically persists
 * changes to localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private _resume = signal<Resume>(this.loadFromStorage());

  /** Read-only signal for the entire resume state. */
  resume = this._resume.asReadonly();
  
  /** Computed signal for profile data. */
  profile = computed(() => this.resume().profile);
  
  /** Computed signal for experience list. */
  experience = computed(() => this.resume().experience);
  
  /** Computed signal for education list. */
  education = computed(() => this.resume().education);
  
  /** Computed signal for projects list. */
  projects = computed(() => this.resume().projects);
  
  /** Computed signal for skills list. */
  skills = computed(() => this.resume().skills);

  constructor() {
    console.log('ResumeService initialized');
    // Effect to auto-save to localStorage whenever state changes
    effect(() => {
      try {
        const data = this._resume();
        localStorage.setItem('ats_resume_data', JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save resume data', e);
      }
    });
  }

  /**
   * Loads the initial state from localStorage or falls back to defaults.
   */
  private loadFromStorage(): Resume {
    try {
      const stored = localStorage.getItem('ats_resume_data');
      return stored ? JSON.parse(stored) : INITIAL_STATE;
    } catch (e) {
      console.error('Failed to load resume data', e);
      return INITIAL_STATE;
    }
  }

  /**
   * Completely replaces the current state with a new one.
   * Useful for importing data.
   * @param state The new Resume object.
   */
  loadState(state: Resume) {
    this._resume.set(state);
  }

  /**
   * Updates partial profile information.
   * @param profile Partial profile data to merge.
   */
  updateProfile(profile: Partial<Profile>) {
    this._resume.update(current => ({
      ...current,
      profile: { ...current.profile, ...profile }
    }));
  }

  /**
   * Adds a new work experience entry.
   */
  addExperience(exp: Experience) {
    this._resume.update(current => ({
      ...current,
      experience: [...current.experience, exp]
    }));
  }

  /**
   * Updates an existing work experience entry.
   * @param id ID of the experience to update.
   * @param exp Partial experience data.
   */
  updateExperience(id: string, exp: Partial<Experience>) {
    this._resume.update(current => ({
      ...current,
      experience: current.experience.map(e => e.id === id ? { ...e, ...exp } : e)
    }));
  }

  /**
   * Removes a work experience entry by ID.
   */
  removeExperience(id: string) {
    this._resume.update(current => ({
      ...current,
      experience: current.experience.filter(e => e.id !== id)
    }));
  }

  /**
   * Adds a new education entry.
   */
  addEducation(edu: Education) {
    this._resume.update(current => ({
      ...current,
      education: [...current.education, edu]
    }));
  }

  /**
   * Updates an existing education entry.
   */
  updateEducation(id: string, edu: Partial<Education>) {
    this._resume.update(current => ({
      ...current,
      education: current.education.map(e => e.id === id ? { ...e, ...edu } : e)
    }));
  }

  /**
   * Removes an education entry by ID.
   */
  removeEducation(id: string) {
    this._resume.update(current => ({
      ...current,
      education: current.education.filter(e => e.id !== id)
    }));
  }

  /**
   * Adds a new project.
   */
  addProject(proj: Project) {
    this._resume.update(current => ({
      ...current,
      projects: [...(current.projects || []), proj]
    }));
  }

  /**
   * Updates an existing project.
   */
  updateProject(id: string, proj: Partial<Project>) {
    this._resume.update(current => ({
      ...current,
      projects: (current.projects || []).map(p => p.id === id ? { ...p, ...proj } : p)
    }));
  }

  /**
   * Removes a project by ID.
   */
  removeProject(id: string) {
    this._resume.update(current => ({
      ...current,
      projects: (current.projects || []).filter(p => p.id !== id)
    }));
  }

  /**
   * Replaces the entire list of skills.
   * @param skills Array of skill strings.
   */
  updateSkills(skills: string[]) {
    this._resume.update(current => ({
      ...current,
      skills
    }));
  }
}
