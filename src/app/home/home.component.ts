import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
import { NotesService } from '../Services/notes.service';
import { BehaviorSubject } from 'rxjs';

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
  cAction = ''
  cTitle = ''
  cContent = ''
  cNoteId: any
  searchedItem = ''
  hideAddNote: boolean = false
  noteAdded: boolean = false;

  constructor(@Inject(OKTA_AUTH) private readonly oktaAuth: OktaAuth, private router: Router, private http: HttpClient, private notesService: NotesService, private cdr: ChangeDetectorRef) { }

  headers: any

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
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

      //verify authorization of the user
      this.http.get(`${this.apiBaseUrl}/auth/verify`, { headers: this.headers }).subscribe({
        next: () => this.checkUserExists(this.headers),
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
  fetchUserNotesBySearchedItem(title: string) {
    this.notesService.getNotesByTitle(title, this.userId).subscribe(result => {
      this.notes = result.data.notesByTitle
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
    if (query == '' && this.userId != '') {
      this.fetchUserNotes(this.headers)
      this.searchedItem = ''
      this.hideAddNote = false
    }
  }

  onAddNoteClick() {
    this.cAction = 'save'
    this.cTitle = ''
    this.cContent = ''
    this.cNoteId = null
    this.showAddNoteComponent = true
  }
  onAddNoteClose(value: Boolean) {
    this.showAddNoteComponent = false
  }
  onNoteSaved(value: Boolean) {
    this.showAddNoteComponent = false
    if (this.searchedItem != '')
      this.fetchUserNotesBySearchedItem(this.searchedItem)
    else {
      this.fetchUserNotes(this.headers)
      this.noteAdded = true
    }
  }
  showTrashIcon(index: number) {
    this.notes[index].showTrash = true
  }
  hideTrashIcon(index: number) {
    this.notes[index].showTrash = false
  }
  deleteNote(index: number, event: Event) {
    event.stopPropagation()
    const noteId = this.notes[index].noteId;
    this.http.delete(`${this.apiBaseUrl}/notes/${noteId}`, { headers: this.headers }).subscribe({
      next: () => {
        this.notes.splice(index, 1)
        this.noteAdded = true
      },
      error: (err) => console.error('Error deleting note: ', err)
    })
  }
  onEditNoteClick(index: number) {
    this.cAction = 'update'
    this.cTitle = this.notes[index].title
    this.cContent = this.notes[index].content
    this.cNoteId = this.notes[index].noteId
    this.showAddNoteComponent = true
  }
  onGetSearchedItem(event: string) {
    this.searchedItem = event
    this.cdr.detectChanges()
    this.showSuggestions = false;
    this.fetchUserNotesBySearchedItem(this.searchedItem)
    this.hideAddNote = true
    console.log(this.hideAddNote)
  }
}
