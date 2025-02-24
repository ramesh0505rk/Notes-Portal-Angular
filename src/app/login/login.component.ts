import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { config } from '../okta-config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  errorMessage: string = ''
  passwordVisible: boolean = false;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
  }

  ngOnInit(): void {
    localStorage.clear()
  }

  async onLoginSubmit() {
    const { username, password } = this.loginForm.value

    try {
      // Perform authentication with Okta
      const transaction = await this.oktaAuth.signInWithCredentials({
        username: username,
        password: password
      });

      console.log("transaction obj ", transaction)

      if (transaction.status === 'SUCCESS') {
        // Save tokens and redirect to the protected page
        await this.oktaAuth.token.getWithRedirect({
          sessionToken: transaction.sessionToken,
          responseType: ['id_token', 'token'],
          scopes: config.scopes,
          redirectUri: config.redirectUri
        });
      }
    } catch (err) {
      if (!this.loginForm.invalid)
        this.errorMessage = `Your username or passowrd is incorrect.`
      else
        this.errorMessage = 'Please enter valid credentials'
      console.error(err);
    }
  }

  async loginWithGoogle() {
    try {
      await this.oktaAuth.signInWithRedirect({
        idp: '0oand6wrxbqW71FxW5d7' // Replace with actual IdP ID from Okta
      });
    } catch (err) {
      this.errorMessage = `${err}`;
      console.error(err);
    }
  }

  onSignUp() {
    this.router.navigate(['/signup'])
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible
  }
}
