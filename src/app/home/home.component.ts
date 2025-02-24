import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { config } from '../okta-config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  isAuthenticated: boolean = false
  userName: string = ''

  constructor(@Inject(OKTA_AUTH) private readonly oktaAuth: OktaAuth) { }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated()
    if (this.isAuthenticated) {
      let user = await this.oktaAuth.getUser()
      this.userName = user.name ?? ''
    }
    console.log(config.clientId)
  }

  async logOut() {
    localStorage.clear()
    this.oktaAuth.signOut()
  }
}
