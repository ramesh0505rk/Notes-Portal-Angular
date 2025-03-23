import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  graphQLApiBaseUrl = 'https://notesserverapi.azurewebsites.net/graphql/'

  constructor(private readonly http: HttpClient) { }

  addNote(userId: string, title: string, content: string): Observable<any> {
    const query = `mutation{
      addNote(userId:"${userId}",title:"${title}",content:"${content}"){
        noteId
      }
    }`

    return this.http.post(this.graphQLApiBaseUrl, { query })
  }
  updateNote(noteId: any, title: string, content: string): Observable<any> {
    const query = `mutation{
      updateNote(noteId:"${noteId}",title:"${title}",content:"${content}"){
        title
        content
        createdDate
      }
    }`
    return this.http.post(this.graphQLApiBaseUrl, { query })
  }
  getNoteTitle(userId: string): Observable<any> {
    const query = `query{
      noteTitles(userId:"${userId}"){
        title
      }
    }`
    return this.http.post(this.graphQLApiBaseUrl, { query })
  }
  getNotesByTitle(title: string, userId: string): Observable<any> {
    const query = `query{
      notesByTitle(title:"${title}",userId:"${userId}"){
        noteId
        userId
        title
        content
        createdDate
      }
    }`
    return this.http.post(this.graphQLApiBaseUrl, { query })
  }
}
