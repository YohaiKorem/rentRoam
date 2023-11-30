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
    return this.ajax(endpoint, 'GET', data);
  }

  post(endpoint: string, data: any = null) {
    return data === null
      ? this.ajax(endpoint, 'POST')
      : this.ajax(endpoint, 'POST', data);
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
      params = new HttpParams({ fromObject: this.serializeData(data) });
    } else {
      body = data;
    }
    console.log(body);

    console.log(method, `${this.BASE_URL}${endpoint}`);

    return this.http
      .request(method, `${this.BASE_URL}${endpoint}`, {
        body,
        params,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  private serializeData(data: any): { [param: string]: string } {
    const serialized: { [param: string]: string } = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object') {
          serialized[key] = JSON.stringify(data[key]);
        } else {
          if (data[key] !== undefined) serialized[key] = data[key].toString();
        }
      }
    }
    return serialized;
  }

  private handleError(error: any) {
    console.error('An error in http service:', error);

    return throwError(() => error);
  }
}
