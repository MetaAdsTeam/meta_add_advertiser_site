import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {environment} from '../../environments/environment';

interface Authorization {
  Authorization: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private authorization = new BehaviorSubject<string>('');
  authorization$ = this.authorization.asObservable();

  api = environment.tornado_api;

  constructor(private httpClient: HttpClient) {}

  serverLogin(login: string, pass: string): Observable<Authorization> {
    return this.httpClient.post<Authorization>(`${this.api}/login`, {login: login, password: pass})
  }

  setToken(auth: Authorization) {
    this.authorization.next(auth.Authorization);
  }

  getToken(): string {
    return this.authorization.value;
  }

}

