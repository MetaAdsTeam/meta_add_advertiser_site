import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppService} from '../app.service';
import {User} from '../model/user.model';
import {Ad} from '../model/ad.model';
import {ActivatedRoute} from '@angular/router';
import {CustomHeader} from './custom-header/calendar-custom-header';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {LuxonDateAdapter, MAT_LUXON_DATE_FORMATS} from '@angular/material-luxon-adapter';
import {DateTime} from 'luxon';
import {Timeslot} from '../model/timeslot.model';

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
  user: User| null = null;
  ad: Ad | undefined;
  selectedAddInfoType: SelectedAddInfoType = 'desc';
  selectedDate: DateTime = DateTime.now();
  place = false;
  timeslots: TimeslotsByType[] = [];

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appService.user$.subscribe(value => {
        this.user = value;
        if (!this.user) {
          this.place = false;
        }
      })
    );
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params =>
        this.subscriptions.add(
          this.appService.getAdById(params['id']).subscribe(value => this.ad = value)
        )
      )
    );
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
    if (!this.user) {
      this.subscriptions.add(
        this.appService.login().subscribe(result => console.log('login', result))
      );
    }
  }

  selectAddInfoType(type: SelectedAddInfoType) {
    this.selectedAddInfoType = type;
  }

  placeAd() {
    if (this.user) {
      this.place = true;
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
