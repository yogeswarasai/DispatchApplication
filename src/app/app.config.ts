import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient } from '@angular/common/http';
// import { DatePipe } from '@angular/common';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync()
//     ,provideHttpClient(),
//     DatePipe
//   ]
// };
import { DatePipe, registerLocaleData } from '@angular/common'; // registerLocaleData from @angular/common
import { LOCALE_ID } from '@angular/core'; // LOCALE_ID from @angular/core
import localeGb from '@angular/common/locales/en-GB'; // Import the en-GB locale

// Register the 'en-GB' locale for date formatting
registerLocaleData(localeGb);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    DatePipe,
    // Set the global LOCALE_ID to 'en-GB' for DD-MM-YYYY format
    { provide: LOCALE_ID, useValue: 'en-GB' }
  ]
};