import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { config } from '../okta-config';
import { SearchComponent } from '../search/search.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuggestionsComponent } from "../suggestions/suggestions.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, CommonModule, FormsModule, SuggestionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  isAuthenticated: boolean = false
  userName: string = ''
  profileImg: string = ''
  showSuggestions: boolean = false
  searchQuery: string = ''

  constructor(@Inject(OKTA_AUTH) private readonly oktaAuth: OktaAuth, private router: Router) { }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated()
    if (this.isAuthenticated) {
      let user = await this.oktaAuth.getUser()
      this.userName = user.name ?? ''
      this.profileImg = this.userName[0].toLowerCase()
    }
    console.log(config.clientId)
  }

  async logOut() {
    localStorage.clear()
    sessionStorage.clear()
    this.oktaAuth.signOut()
  }

  onLogoClick() {
    window.location.reload()
  }
  canShowSuggestion(value: boolean) {
    this.showSuggestions = value
    console.log(this.showSuggestions)
  }
  closeSuggestions(event: Event) {
    this.showSuggestions = false
  }
  updateSearchQuery(query: string) {
    this.searchQuery = query;
    this.showSuggestions = query.length > 0;
  }
}
