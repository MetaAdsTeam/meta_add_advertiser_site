import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {of} from 'rxjs/internal/observable/of';
import {Ad} from './model/ad.model';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {User} from './model/user.model';
import {ConnectComponent} from './connect/connect.component';
import {MatDialog} from '@angular/material/dialog';
import {Timeslot} from './model/timeslot.model';

@Injectable({providedIn: 'root'})
export class AppService {
  private signed = new BehaviorSubject<boolean>(false);
  signed$ = this.signed.asObservable();
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  constructor(private dialog: MatDialog) {}

  /* test data */
  private ads: Ad[] = [
    {id: '1', url: 'assets/images/test/add0.png', name: 'Mall', price: '$299,45', likes: 234, usersPerWeek: 111, totalUsers: 3456, owner: 'Owner LTD', desc: 'added'},
    {id: '2', url: 'assets/images/test/add1.png', name: 'Subway'},
    {id: '3', url: 'assets/images/test/add2.png', name: 'Business Center'}
    ];

  private testUser: User = {
    username: 'f740375728......9d5c25529'
  };

  private timeslots: Timeslot[] = [
    {id: 1, from_time: '2020-02-03T09:24:15', to_time: '2020-02-03T09:30:15', locked: false},
    {id: 2, from_time: '2020-02-03T09:35:15', to_time: '2020-02-03T09:40:15', locked: false},
    {id: 3, from_time: '2020-02-03T12:50:15', to_time: '2020-02-03T12:55:15', locked: false},
    {id: 4, from_time: '2020-02-03T14:04:15', to_time: '2020-02-03T14:24:15', locked: false}
  ]
/* t 1643835600000

 */

  /* end test data */

  login(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConnectComponent, {
      width: '592px',
      height: '418px',
      maxHeight: '100%',
      // disableClose: true,
      // panelClass: 'connect-dialog-panel',
      backdropClass: 'modal-backdrop'
    });
    return dialogRef.afterClosed()
  }

  signIn(secret: string): Observable<boolean> {
    /* test code */
    const signed = secret === 'secret';
    /* end */
    this.signed.next(signed);
    this.user.next(signed ? this.testUser : null);

    return of(signed);
  }

  signOut() {
    this.signed.next(false);
    this.user.next(null);
  }

  getAds(filter: string = 'all'): Observable<Ad[]> {
    return of(this.ads)
  }

  getAdById(id: string): Observable<Ad | undefined> {
    return of(this.ads.find(a => a.id === id))
  }

  getAvailableSlots(adId: string): Observable<Timeslot[]> {
    return of(this.timeslots);
  }

}
