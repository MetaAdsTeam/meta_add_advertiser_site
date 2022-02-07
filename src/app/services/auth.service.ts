import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

interface Authorization {
  Authorization: string
}

const lsKey = 'ma-token';

@Injectable({providedIn: 'root'})
export class AuthService {
  private authorization = new BehaviorSubject<string>('');
  authorization$ = this.authorization.asObservable();

  api = environment.tornado_api;

  constructor(private httpClient: HttpClient) {}

  serverLogin(login: string, pass: string): Observable<string> {
    return this.httpClient.post<Authorization>(`${this.api}/login`, {"login": login, "password": pass})
      .pipe(
        map(value => {return value.Authorization.split(' ')[1]})
      )
  }

  testServerLogin() {
    this.serverLogin("admin", "admin").subscribe(value => this.setToken(value));
  }

  /* todo: get token from local storage on start, if null then call logon */
  loadToken(): boolean {
    const token = this.getToken();
    if (token) {
      this.authorization.next(token);
      return true
    } else {
      return false;
    }
  }

  setToken(token: string) {
    localStorage.setItem(lsKey, token);
    this.authorization.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem(lsKey);
    // return this.authorization.value;
  }

  clearTokenInStorage() {
    localStorage.removeItem(lsKey);
  }
}

