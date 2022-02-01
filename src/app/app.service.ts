import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {of} from 'rxjs/internal/observable/of';
import {Ad} from './model/ad.model';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {User} from './model/user.model';

@Injectable({providedIn: 'root'})
export class AppService {
  private signed = new BehaviorSubject<Boolean>(false);
  signed$ = this.signed.asObservable();
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();
  private connected = new BehaviorSubject<Boolean>(false);
  connected$ = this.connected.asObservable();


  /* test data */
  private ads: Ad[] = [
    {id: '1', url: 'assets/images/test/add0.png', name: 'Mall', price: '$299,45', likes: 234, usersPerWeek: 111, totalUsers: 3456, owner: 'Owner LTD', desc: 'added'},
    {id: '2', url: 'assets/images/test/add1.png', name: 'Subway'},
    {id: '3', url: 'assets/images/test/add2.png', name: 'Business Center'}
    ];

  private testUser: User = {
    username: 'test',
    avatar: '/no',
    name: 'John',
    surname: 'Worthington'
  };

  /* end test data */
  signIn() {
    this.signed.next(true);
    this.user.next(this.testUser);
  }

  signOut() {
    this.signed.next(false);
    this.user.next(null);
  }

  getAds(): Observable<Ad[]> {
    return of(this.ads)
  }

  getAdById(id: string): Observable<Ad | undefined> {
    return of(this.ads.find(a => a.id === id))
  }

}
