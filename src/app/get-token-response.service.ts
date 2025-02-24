import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetTokenResponseService {

  baseUrl: string = 'https://dev-42709845.okta.com/api/v1'


  constructor(private http: HttpClient) { }


  getActivationToken(userProfile: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/registration/regn3glvg80mKCqw35d7/register`,
      { userProfile },
      { headers }
    )
  }

  getSessionDetails(token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/authn`,
      { token },
      { headers }
    )
  }

}
//regn3glvg80mKCqw35d7 - notes app