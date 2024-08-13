import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-MX';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withDisabledInitialNavigation,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { provideClientHydration } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { appRoutes } from './app.routes';

registerLocaleData(localeEs, 'es-MX');

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withDisabledInitialNavigation(),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withViewTransitions()
    ),
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    { provide: LOCALE_ID, useValue: 'es-MX' },
    importProvidersFrom(
      NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
    ),
  ],
};
