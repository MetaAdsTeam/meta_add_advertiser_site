import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppService, AuthService} from '../services';
import {Adspot} from '../model/adspot.model';
import {ActivatedRoute} from '@angular/router';
import {CustomHeader} from './custom-header/calendar-custom-header';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {LuxonDateAdapter, MAT_LUXON_DATE_FORMATS} from '@angular/material-luxon-adapter';
import {DateTime} from 'luxon';
import {finalize} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

type SelectedAddInfoType = 'desc' | 'history';

export interface ComponentType<T = any> {
  new (...args: any[]): T;
}

interface FormattedTimeslot {
  id: number,
  from: string,
  locked: boolean
  type: string
}

interface TimeslotsByType {
  [type: number]: FormattedTimeslot
}

export enum TimeslotType {
  AM = 'AM',
  PM = 'PM'
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
  // user: User| null = null;
  signed = false;
  ad: Adspot | undefined;
  selectedAddInfoType: SelectedAddInfoType = 'desc';
  selectedDate: DateTime = DateTime.now();
  place = false;
  timeslots: TimeslotsByType[] = [];
  private id: number;

  loading: boolean = false;

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      /*
      this.appService.user$.subscribe(value => {
        this.user = value;
        if (!this.user) {
          this.place = false;
        }
      })
      */
      this.appService.signed$.subscribe(value => {
        this.signed = value;
        this.place = value;
      })
    );
    this.loading = true;
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        this.subscriptions.add(
          this.loadAdspot()
        )
      })
    );

    /* todo: can duplicate api call - to fix */
    this.subscriptions.add(
      this.authService.authorization$.subscribe(
        value => {
          if (value) {
            // this.loadAdspot()
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
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
    if (this.ad) {
      this.subscriptions.add(
        this.appService.getAvailableSlots(this.ad.id)
          .subscribe(value => {
            const ft: FormattedTimeslot[] = value.map(v => {
              const date = DateTime.fromISO(v.from_time).toLocaleString(DateTime.TIME_SIMPLE).split(' ')[0];
              return {
                ...v,
                from: date.replace(':', '.'),
                type: +date.split(':')[0] >= 12 ? TimeslotType.PM : TimeslotType.AM}
            });
            this.timeslots[0] = ft.filter(t => t.type === TimeslotType.AM);
            this.timeslots[1] = ft.filter(t => t.type === TimeslotType.PM);
            console.log(this.timeslots);
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

  selectAddInfoType(type: SelectedAddInfoType) {
    this.selectedAddInfoType = type;
  }

  placeAd() {
    console.log('place', this.signed);
    this.place = this.signed;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
