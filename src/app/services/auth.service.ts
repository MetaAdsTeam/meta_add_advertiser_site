import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  /** unused **/
  serverLogin(login: string, pass: string): Observable<string> {
    return this.httpClient.post<Authorization>(`${this.api}/login`, {"login": login, "password": pass})
      .pipe(
        map(value => {return value.Authorization.split(' ')[1]})
      )
  }

  tempLogin(login: string) {
    this.httpClient.post<Authorization>(`${this.api}/login`, {"login": login})
      .pipe(
        map(value => {
          return value.Authorization.split(' ')[1]
        })
      )
      .subscribe(value => this.setToken(value))
  }

  /** unused */
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
  }

  clearTokenInStorage() {
    localStorage.removeItem(lsKey);
  }
}

