import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {
  Adspot,
  AdspotList,
  Timeslot,
  TimeslotList,
  Creative,
  CreativeBE,
  PlaybackBody,
  Playback
} from '../model';
import {NearService} from './near.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {DateTime} from 'luxon';
import {AuthService} from './auth.service';
import {PopupService} from './popup.service';

@Injectable({providedIn: 'root'})
export class AppService {
  private signed = new BehaviorSubject<boolean>(false);
  signed$ = this.signed.asObservable();
  private nearAccountId = new BehaviorSubject<string>('');
  nearAccountId$ = this.nearAccountId.asObservable();

  api = environment.tornado_api;

  constructor(private nearService: NearService,
              private httpClient: HttpClient,
              private authService: AuthService,
              private popupService: PopupService) {}

  nearLogin(): Observable<boolean> {
    return this.popupService.popupNearLogin();
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
    this.nearAccountId.next(accountId);

    return of(signed);
  }

  setSignIn() {
    const accountId = this.nearService.getAccountId();
    const signed = !(!accountId);
    this.signed.next(signed);
    this.nearAccountId.next(accountId);
    this.authService.clearTokenInStorage();
  }

  signOut() {
    this.nearService.nearSignOut();
    this.signed.next(false);
    this.nearAccountId.next('');
  }

  getAds(filter: string = 'all'): Observable<Adspot[]> {
    // return of(this.ads)
    return this.httpClient.get<AdspotList>(`${this.api}/adspots`)
      .pipe(map(l => {return l?.data}))
  }

  getAdById(id: number): Observable<Adspot> {
    return this.httpClient.get<Adspot>(`${this.api}/adspot/id/${id}`)
  }

  getTimeslots(adId: number, date: string): Observable<Timeslot[]> {
    return this.httpClient.get<TimeslotList>(`${this.api}/timeslots_by_adspot/id/${adId}/date/${date}`)
      .pipe(
        map(l => {
          if (l) {
            return l.data.map(a => {
              return {...a, from_time: DateTime.fromISO(a.from_time), to_time: DateTime.fromISO(a.to_time)}
            });
          } else {
            return []
          }
        })
      )
  }

  getCreatives(): Observable<Creative[]> {
    return this.httpClient.get<CreativeBE>(`${this.api}/creatives`)
      .pipe(
        map(c => { return c.data })
      );
  }

  saveCreative(name: string, description: string, filename: string, file: File): Observable<any> {
    const formData = {name, description, filename, file};
    return this.httpClient.post<any>(`${this.api}/creative`, formData, {reportProgress: true, observe: 'events'});
  }

  markCreativeAsNft(creativeId: number, blockchainRef: string): Observable<any> {
    return this.httpClient.put(`${this.api}/creative/id/${creativeId}`, {blockchain_ref: blockchainRef})
  }

  pay(playback: PlaybackBody): Observable<Playback> {
    return this.httpClient.post<Playback>(`${this.api}/playback`, playback);
  }

  markPlaybackAsNft(playbackId: number, status: string, smartContract: number): Observable<any> {
    return this.httpClient.put(`${this.api}/playback/id/${playbackId}`, {status: status, smart_contract: smartContract.toString()})
  }
}
