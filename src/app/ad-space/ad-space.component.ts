import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppService, StorageService} from '../services';
import {Adspot} from '../model';
import {ActivatedRoute} from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {LuxonDateAdapter, MAT_LUXON_DATE_FORMATS} from '@angular/material-luxon-adapter';
import {finalize} from 'rxjs/operators';
import {PlaceAdStorageModel} from '../model/place-ad-storage.model';

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
  signed = false;
  ad: Adspot | undefined;
  selectedAddInfoType: SelectedAddInfoType;

  isVisiblePlaceAd = false;
  private id: number;
  loading: boolean = false; /* not used */

  savedPlaceAd: PlaceAdStorageModel | null;

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private storageService: StorageService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appService.signed$.subscribe(value => {
        this.signed = value;
        this.selectedAddInfoType =  'desc';
      })
    );
    this.loading = true;
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        this.loadAdspot();
      })
    );

    this.savedPlaceAd = this.storageService.getPlaceAdFromStorage();
    if (this.savedPlaceAd) {
      this.showPlaceAd();
      this.storageService.clearPlaceAdInStorage();
    }
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
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
