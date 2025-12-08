import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ResumeService } from '../../services/resume.service';
import { Resume, Experience, Education, Project } from '../../models/resume.models';

/**
 * Editor form providing the UI for data input.
 * 
 * Uses Reactive Forms to manage user input and synchronizes with the `ResumeService`.
 * Supports importing and exporting data as JSON/PDF.
 */
@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
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

  /** Initializes the reactive form group with data. */
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

    // Simple auto-save listener on profile changes
    this.form.get('profile')?.valueChanges.subscribe(p => this.resumeService.updateProfile(p));
  }

  /**
   * Exports the current resume state as a JSON file.
   */
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

  /**
   * Imports a JSON file and repopulates the resume state.
   */
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
  /** Accessor for the experience FormArray */
  get experienceControls() { return this.form.get('experience') as FormArray; }
  /** Accessor for the education FormArray */
  get educationControls() { return this.form.get('education') as FormArray; }
  /** Accessor for the projects FormArray */
  get projectsControls() { return this.form.get('projects') as FormArray; }

  // --- EXPERIENCE HELPER METHODS ---

  /**
   * Creates a FormGroup for a single experience entry.
   * Sets up a value change listener to auto-update the service.
   * @param e The experience data object.
   */
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

  /**
   * Adds a new empty experience entry to the Resume and the Form.
   * @param e Click event to stop propagation.
   */
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

  /**
   * Removes an experience entry by index.
   * @param index Zero-based index of the entry.
   */
  removeExperience(index: number) {
     const id = this.experienceControls.at(index).get('id')?.value;
     this.resumeService.removeExperience(id);
     this.experienceControls.removeAt(index);
  }

  // --- EDUCATION HELPER METHODS ---

  /**
   * Creates a FormGroup for a single education entry.
   * @param e The education data object.
   */
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

  /**
   * Adds a new empty education entry.
   * @param e Click event to stop propagation.
   */
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

  /**
   * Removes an education entry by index.
   * @param index Zero-based index of the entry.
   */
  removeEducation(index: number) {
    const id = this.educationControls.at(index).get('id')?.value;
    this.resumeService.removeEducation(id);
    this.educationControls.removeAt(index);
  }

  // --- PROJECT HELPER METHODS ---

  /**
   * Creates a FormGroup for a single project entry.
   * @param p The project data object.
   */
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

  /**
   * Adds a new empty project entry.
   * @param e Click event to stop propagation.
   */
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

  /**
   * Removes a project entry by index.
   * @param index Zero-based index of the entry.
   */
  removeProject(index: number) {
    const id = this.projectsControls.at(index).get('id')?.value;
    this.resumeService.removeProject(id);
    this.projectsControls.removeAt(index);
  }

  // --- SKILLS & UTILS ---

  /**
   * Parses the skills text area and updates the state.
   */
  updateSkills() {
    const raw = this.skillsControl.value || '';
    const skills = raw.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    this.resumeService.updateSkills(skills);
  }

  /**
   * Toggles the visibility of a form section.
   * @param section The section identifier.
   */
  toggle(section: string) {
    this.openSection = this.openSection === section ? '' : section;
  }

  /**
   * Invokes the browser's native print dialog to generating the PDF.
   */
  exportPdf() {
    window.print();
  }
}
