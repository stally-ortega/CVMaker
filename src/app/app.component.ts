import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './components/editor/editor.component';
import { PreviewComponent } from './components/preview/preview.component';

// --- APP ROOT COMPONENT ---

/**
 * Root component that defines the main split-screen layout.
 * - Left Panel: `EditorComponent`
 * - Right Panel: `PreviewComponent`
 */
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
