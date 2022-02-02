import {ChangeDetectionStrategy, Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {AppService} from '../app.service';
import {User} from '../model/user.model';
import {Ad} from '../model/ad.model';
import {ActivatedRoute} from '@angular/router';
import {CustomHeader} from './custom-header/calendar-custom-header';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {LuxonDateAdapter, MAT_LUXON_DATE_FORMATS} from '@angular/material-luxon-adapter';

type SelectedAddInfoType = 'desc' | 'history';

export interface ComponentType<T = any> {
  new (...args: any[]): T;
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
  selectedDate: Date = new Date();
  place = false;

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appService.user$.subscribe(value => {
        this.user = value;
        if (!this.user) {
          this.place = false;
        }
        console.log('user', value);
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
    console.log('event', event, this.selectedDate);
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
