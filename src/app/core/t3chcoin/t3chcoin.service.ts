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

  getTopFillSocials(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/social/full`)
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  getSocial(socialId: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/social/${socialId}`)
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  getUserTopList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/user`)
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  getUser(userId: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/user/${userId}`)
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  addUser(userId: string, userName: string, socialId: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/user`, { userId, userName, socialId })
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  updateUser(userId: string, username: string, avatar: string, selecteditem: string): Observable<any> {
    return this.http
      .put(`${environment.apiUrl}/user/${userId}`, {
        username: username,
        avatar: this.stringToBytes32(avatar),
        selecteditem: this.stringToBytes32(selecteditem)})
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  buyItem(userId: string, itemId: string): Observable<any> {
    return this.http
      .put(`${environment.apiUrl}/user/${userId}/buy/${this.stringToBytes32(itemId)}`, {})
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }


  getItemsCatalog(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/catalog/`)
      .map(res => this.extractData(res))
      .catch(this.handleError);
  }

  stringToBytes32(text) {
    let result = String(text);
    while (result.length < 64) { result = '0' + result; }
    return '0x' + result;
}

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
