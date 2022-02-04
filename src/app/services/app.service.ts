import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Adspot} from '../model/adspot.model';
import {User} from '../model/user.model';
import {ConnectComponent} from '../connect/connect.component';
import {MatDialog} from '@angular/material/dialog';
import {Timeslot} from '../model/timeslot.model';
import {NearService} from './near.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AppService {
  private signed = new BehaviorSubject<boolean>(false);
  signed$ = this.signed.asObservable();
  private user = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  api = environment.tornado_api;

  constructor(private dialog: MatDialog,
              private nearService: NearService,
              private httpClient: HttpClient) {}

  /* test data */

  private timeslots: Timeslot[] = [
    {id: 1, from_time: '2020-02-03T09:24:15', to_time: '2020-02-03T09:30:15', locked: false},
    {id: 2, from_time: '2020-02-03T09:35:15', to_time: '2020-02-03T09:40:15', locked: false},
    {id: 3, from_time: '2020-02-03T12:50:15', to_time: '2020-02-03T12:55:15', locked: false},
    {id: 4, from_time: '2020-02-03T14:04:15', to_time: '2020-02-03T14:24:15', locked: false}
  ];

  /* end test data */

  nearLogin(): Observable<boolean> {
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

  signIn(): Observable<boolean> {
    const accountId = this.nearService.getAccountId();
    let signed = false;
    if (!accountId) {
      this.nearService.nearSignIn();
      // signed = false;
    } else {
      signed = true
    }

    this.signed.next(signed);
    this.user.next({accountId: accountId});

    return of(signed);
  }

  setSignIn() {
    const accountId = this.nearService.getAccountId();
    const signed = !(!accountId);

    this.signed.next(signed);
    this.user.next({accountId: accountId});
  }

  signOut() {
    this.nearService.nearSignOut();
    this.signed.next(false);
    this.user.next(null);
  }

  getAds(filter: string = 'all'): Observable<Adspot[]> {
    // return of(this.ads)
    return this.httpClient.get<Adspot[]>(`${this.api}/adspots`)
  }

  getAdById(id: number): Observable<Adspot | undefined> {
    // return of(this.ads.find(a => a.id === id))
    return of(undefined)
  }

  getAvailableSlots(adId: number): Observable<Timeslot[]> {
    return of(this.timeslots);
  }

}
