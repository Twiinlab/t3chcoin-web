import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';

@Injectable()
export class T3chcoinService {

  constructor(
    private http: Http
  ) { }

  getTopSocials(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/social`)
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  getUserTopList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/user`)
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  // postGreeting(name: string, description: string): Observable<any> {
  //   return this.http
  //     .post(environment.apiUrl, { name, description })
  //     .delay(500)
  //     .map(res => this.extractData(res))
  //     .catch(this.handleError);
  // }

  // deleteGreeting(name: string): Observable<any> {
  //   return this.http
  //     .delete(`${environment.apiUrl}/${name}`)
  //     .delay(500)
  //     .map(res => this.extractData(res))
  //     .catch(this.handleError);
  // }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    return res.json() || {};
  }

  private handleError(error: any) {
    const errMsg = error.message || 'Server error';
    return Promise.reject(errMsg);
  }

}
