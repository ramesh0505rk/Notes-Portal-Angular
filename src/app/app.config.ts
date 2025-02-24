import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import OktaAuth from '@okta/okta-auth-js';
import { provideHttpClient } from '@angular/common/http';
import { OKTA_AUTH, OKTA_CONFIG, OktaAuthGuard } from '@okta/okta-angular';
import { config } from './okta-config';

const configuration = new OktaAuth(config)
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    { provide: OKTA_AUTH, useValue: configuration },
    { provide: OKTA_CONFIG, useValue: config },
    OktaAuthGuard
  ]
};