import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';

/**
 * Visual presentation of the CV.
 * 
 * This component listens to the `ResumeService` signals and renders the
 * printable A4 layout. It is a modification-free zone.
 */
@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent {
  resumeService = inject(ResumeService);
  resume = this.resumeService.resume;

  /**
   * Helper to split duty descriptions by newline for bullet points.
   */
  splitLines(text: string): string[] {
    return text.split('\\n').filter(d => d.trim().length > 0);
  }

  /**
   * Ensures links have a valid protocol.
   */
  getUrl(link: string): string {
    if (!link) return '';
    return link.startsWith('http') ? link : 'https://' + link;
  }
}
