import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { config } from '../okta-config';
import { SearchComponent } from '../search/search.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuggestionsComponent } from "../suggestions/suggestions.component";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddNoteComponent } from '../add-note/add-note.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, CommonModule, FormsModule, SuggestionsComponent, AddNoteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  isAuthenticated: boolean = false
  userName: string = ''
  userId: string = ''
  userEmail: string = ''
  profileImg: string = ''
  showSuggestions: boolean = false
  searchQuery: string = ''
  apiBaseUrl = 'https://localhost:44354/api'
  notes: any[] = []
  showAddNoteComponent: boolean = false

  constructor(@Inject(OKTA_AUTH) private readonly oktaAuth: OktaAuth, private router: Router, private http: HttpClient) { }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated()
    if (this.isAuthenticated) {
      let user = await this.oktaAuth.getUser()
      this.userName = user.name ?? ''
      this.userEmail = user.email ?? ''
      this.userId = user.sub ?? ''
      this.profileImg = this.userName[0].toLowerCase()
      console.log(config.clientId, ' ', this.userEmail, ' ', this.userId, ' ', this.userName)

      const token = await this.oktaAuth.getAccessToken()
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

      //verify authorization of the user
      this.http.get(`${this.apiBaseUrl}/auth/verify`, { headers }).subscribe({
        next: () => this.checkUserExists(headers),
        error: (err) => {
          console.error('Unauthorized: ', err)
        }
      })
    }
  }

  checkUserExists(headers: HttpHeaders) {
    this.http.get(`${this.apiBaseUrl}/users/${this.userId}`, { headers }).subscribe({
      next: (res) => {
        console.log(res)
        this.fetchUserNotes(headers)
      },
      error: () => this.createUser(headers)
    })
  }

  createUser(headers: HttpHeaders) {

    const userPayload = {
      UserId: this.userId,
      UserName: this.userName,
      UserEmail: this.userEmail
    }

    this.http.post(`${this.apiBaseUrl}/users/create`, userPayload, { headers }).subscribe({
      next: () => this.fetchUserNotes(headers),
      error: (err) => console.error("Error creating user: ", err)
    })
  }

  fetchUserNotes(headers: HttpHeaders) {
    this.http.get(`${this.apiBaseUrl}/notes/${this.userId}`, { headers }).subscribe({
      next: (notes: any) => {
        this.notes = notes ? notes : []
        console.log(this.notes)
      },
      error: (err) => console.error('Error fetching notes: ', err)
    })
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
  }
  closeSuggestions(event: Event) {
    this.showSuggestions = false
  }
  updateSearchQuery(query: string) {
    this.searchQuery = query;
    this.showSuggestions = query.length > 0;
  }

  onAddNoteClick() {
    this.showAddNoteComponent = true
  }
}
