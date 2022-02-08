import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppService, AuthService, NearService} from '../services';
import {Adspot} from '../model/adspot.model';
import {ActivatedRoute} from '@angular/router';
import {CustomHeader} from './custom-header/calendar-custom-header';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {LuxonDateAdapter, MAT_LUXON_DATE_FORMATS} from '@angular/material-luxon-adapter';
import {DateTime} from 'luxon';
import {finalize} from 'rxjs/operators';
import {Timeslot} from '../model/timeslot.model';

type SelectedAddInfoType = 'desc' | 'history' | 'both';

export interface ComponentType<T = any> {
  new (...args: any[]): T;
}

interface TimeslotsByType {
  am: Timeslot[],
  pm: Timeslot[]
}

@Component({
  selector: 'app-ad-space',
  templateUrl: './ad-space.component.html',
  styleUrls: ['./ad-space.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: LuxonDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_LUXON_DATE_FORMATS}
  ]
})
export class AdSpaceComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  signed = false;
  ad: Adspot | undefined;
  selectedAddInfoType: SelectedAddInfoType;
  // showHistory = false;
  selectedDate: DateTime = DateTime.now().setLocale('en');
  isVisiblePlaceAd = false;
  private id: number;
  loading: boolean = false;

  timeslots: TimeslotsByType = {am: [], pm: []};
  selectedTimeslot: Timeslot;

  /*****/
  message: any;

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appService.signed$.subscribe(value => {
        this.signed = value;
        this.selectedAddInfoType =  value ? 'desc' : 'both';
      })
    );
    this.loading = true;
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        this.loadAdspot();
      })
    );

    /** not working */
    // this.nearService.contract.getMessages({accountId: 'example-account.testnet'}).then(val => console.log(val))
  }

  loadAdspot() {
    if (this.id) {
      this.subscriptions.add(
        this.appService.getAdById(this.id)
          .pipe(
            finalize(
              () => this.loading = false
            )
          )
          .subscribe(value => this.ad = {...value, preview_url: 'assets/images/test/add0.png'})
      );
    }
  }

  getCustomHeader(): ComponentType<any> {
    return CustomHeader
  }

  selectDate(event: any) {
    this.loadTimespots();
  }

  loadTimespots() {
    let minAvailableTime = DateTime.now();
    console.log('before', minAvailableTime);
    minAvailableTime.plus({minutes: 3});
    console.log('after', minAvailableTime);
    
    if (this.selectedDate < minAvailableTime) {
      this.timeslots.am = [];
      this.timeslots.pm = [];
    }
    if (this.ad) {
      this.subscriptions.add(
        this.appService.getTimeslots(this.ad.id, this.selectedDate.toFormat('yyyy-MM-dd'))
          .subscribe(value => {

            this.timeslots.am = value.filter(v => v.from_time.hour < 12);
            this.timeslots.pm = value.filter(v => v.from_time.hour >= 12);
            console.log('am', this.timeslots.am, 'pm', this.timeslots.pm);
          })
      );
    }
  }

  signIn() {
    if (!this.signed) {
      this.subscriptions.add(
        this.appService.nearLogin().subscribe(result => console.log('nearLogin', result))
      );
    }
  }

  selectAddInfoType() {
    this.selectedAddInfoType = this.selectedAddInfoType === 'desc' ? 'history' : 'desc';
  }

  showPlaceAd() {
    this.isVisiblePlaceAd = this.signed;
    if (this.signed) {
      this.loadTimespots();
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
