import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetTokenResponseService } from '../get-token-response.service';
import { config } from '../okta-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  email: string = ''
  password: string = ''
  firstName: string = ''
  lastName: string = ''
  passwordVisible: boolean = false

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private http: HttpClient, private getTokenResponses: GetTokenResponseService, private router: Router) {

  }

  private activationToken: any = null
  private tokenResponses: any = null

  async onSignUp() {

    const userProfile = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password
    }



    this.activationToken = await this.getTokenResponses.getActivationToken(userProfile).toPromise()
    console.log('activation token ', this.activationToken.activationToken)

    this.tokenResponses = await this.getTokenResponses.getSessionDetails(this.activationToken.activationToken).toPromise()
    console.log('Session details,\n', this.tokenResponses)

    if (this.tokenResponses.status === 'SUCCESS') {
      await this.oktaAuth.token.getWithRedirect({
        sessionToken: this.tokenResponses.sessionToken,
        responseType: ['id_token', 'token'],
        scopes: config.scopes,
        redirectUri: config.redirectUri
      })
    }

  }
  onSignIn() {
    this.router.navigate(['/login'])
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible
  }

}