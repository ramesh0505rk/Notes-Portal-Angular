import { Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [OktaAuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'login/callback', component: OktaCallbackComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

