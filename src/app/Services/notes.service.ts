import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  graphQLApiBaseUrl = 'https://localhost:44354/api/graphql'

  constructor(private readonly http: HttpClient) { }

  addNote(userId: string, title: string, content: string): Observable<any> {
    const query = `mutation{
      addNote(userId:${userId},title:${title},content:${content}){
        noteId
      }
    }`

    return this.http.post(this.graphQLApiBaseUrl, { query })
  }
}
