import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-MX';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { es } from 'date-fns/locale';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { appRoutes } from './app.routes';

registerLocaleData(localeEs, 'es-MX');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withViewTransitions()
    ),
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideDateFnsAdapter(),
    provideCharts(withDefaultRegisterables()),
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: MAT_DATE_LOCALE, useValue: es },
    {
      provide: MAT_CARD_CONFIG,
      useValue: { appearance: 'outlined' },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { maxWidth: '100vw' } },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { verticalPosition: 'top', duration: 3_000 },
    },
  ],
};
