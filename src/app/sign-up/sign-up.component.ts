import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { HttpClient } from '@angular/common/http';
import { GetTokenResponseService } from '../get-token-response.service';
import { config } from '../okta-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  loginForm: FormGroup
  errorMessage: string = ''
  passwordVisible: boolean = false

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private http: HttpClient, private getTokenResponses: GetTokenResponseService, private router: Router) {
    this.loginForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
  }

  private activationToken: any = null
  private tokenResponses: any = null

  async onSignUp() {

    const { firstname, lastname, email, password } = this.loginForm.value

    try {
      const userProfile = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password
      }

      this.activationToken = await this.getTokenResponses.getActivationToken(userProfile).toPromise()

      this.tokenResponses = await this.getTokenResponses.getSessionDetails(this.activationToken.activationToken).toPromise()

      if (this.tokenResponses.status === 'SUCCESS') {
        await this.oktaAuth.token.getWithRedirect({
          sessionToken: this.tokenResponses.sessionToken,
          responseType: ['id_token', 'token'],
          scopes: config.scopes,
          redirectUri: config.redirectUri
        })
      }
    }
    catch (err: any) {
      if (this.loginForm.invalid) {
        this.errorMessage = 'Please enter valid details.'
      }
      else {
        this.errorMessage = err?.error?.errorCauses[0].errorSummary
      }
    }

  }
  onSignIn() {
    this.router.navigate(['/login'])
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible
  }
}