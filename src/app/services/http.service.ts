import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private BASE_URL =
    environment.production === true ? '/api/' : '//localhost:3030/api/';

  constructor(private http: HttpClient) {}

  get(endpoint: string, data?: any) {
    console.log(data);

    return this.ajax(endpoint, 'GET', data);
  }

  post(endpoint: string, data: any) {
    return this.ajax(endpoint, 'POST', data);
  }

  put(endpoint: string, data: any) {
    return this.ajax(endpoint, 'PUT', data);
  }

  delete(endpoint: string, data?: any) {
    return this.ajax(endpoint, 'DELETE', data);
  }

  private ajax(endpoint: string, method: string, data: any = null) {
    let params = new HttpParams();
    let body = null;

    if (method === 'GET') {
      params = new HttpParams({ fromObject: data });
    } else {
      body = data;
    }

    return this.http
      .request(method, `${this.BASE_URL}${endpoint}`, {
        body,
        params,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);

    return throwError(error);
  }
}
