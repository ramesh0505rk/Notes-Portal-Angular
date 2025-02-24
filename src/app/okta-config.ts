import { Injector } from "@angular/core";
import OktaAuth from "@okta/okta-auth-js";
import { Router } from "@angular/router";

export const config = {
    clientId: '0oan3gfxq0oASwNwD5d7',
    issuer: 'https://dev-42709845.okta.com/oauth2/default',
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    onAuthRequired: (oktaAuth: OktaAuth, injector: Injector) => {
        console.log('Redirecting to custom login component');
        const navigationService = injector.get(Router);
        navigationService.navigate(['/login']) // Redirect to your custom login component
    }
}