import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

/**
 * Main application configuration.
 *
 * Configures the dependency injection providers for the standalone application,
 * including Angular's zone change detection and animation support.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations()
  ]
};
