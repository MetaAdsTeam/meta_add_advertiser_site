import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppService, AuthService, NearService} from '../services';
import {Adspot} from '../model/adspot.model';
import {ActivatedRoute} from '@angular/router';
import {CustomHeader} from './custom-header/calendar-custom-header';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {LuxonDateAdapter, MAT_LUXON_DATE_FORMATS} from '@angular/material-luxon-adapter';
import {DateTime} from 'luxon';
import {finalize, max} from 'rxjs/operators';
import {Timeslot} from '../model/timeslot.model';
import {Creative} from '../model/creative.model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {ConnectComponent} from '../connect/connect.component';
import {MatDialog} from '@angular/material/dialog';
import {ProgressPopupComponent} from '../progress-popup/progress-popup.component';
import {ProgressService} from '../services/progress.service';

type SelectedAddInfoType = 'desc' | 'history' | 'both';

export interface ComponentType<T = any> {
  new (...args: any[]): T;
}

interface TimeslotsByType {
  am: Timeslot[],
  pm: Timeslot[]
}

function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
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
  selectedDate: DateTime = DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}).setLocale('en');
  isVisiblePlaceAd = false;
  private id: number;
  loading: boolean = false; /* not used */

  /* timeslot */
  timeslots: TimeslotsByType = {am: [], pm: []};
  selectedTimeslot: Timeslot;

  /* creative */
  creatives: Creative[];
  selectedCreativeId: number;
  creating = false;
  creativeName = '';
  creativeDescription = '';

  /* upload creative file */
  isSaving: boolean;
  file: any;
  filename: string;

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private nearService: NearService,
              private progressService: ProgressService) { }

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
    this.loadTimeslots();
  }

  loadTimeslots() {
    const minAvailableTime = DateTime.now().plus({minutes: 3});
    const today = DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0});
    let maxAvailableTime: DateTime;
    if (+today === +this.selectedDate) {
      maxAvailableTime = DateTime.now().plus({hours: 2});
    } else {
      maxAvailableTime = this.selectedDate.plus({hours: 2});
    }

    if (this.selectedDate < minAvailableTime) {
      this.timeslots.am = [];
      this.timeslots.pm = [];
    }
    if (this.ad) {
      this.subscriptions.add(
        this.appService.getTimeslots(this.ad.id, this.selectedDate.toFormat('yyyy-MM-dd'))
          .subscribe(value => {
            this.timeslots.am = value.filter(v => v.from_time.hour < 12 && v.from_time > minAvailableTime && v.from_time < maxAvailableTime);
            this.timeslots.pm = value.filter(v => v.from_time.hour >= 12 && v.from_time > minAvailableTime && v.from_time < maxAvailableTime);
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
      this.loadTimeslots();
      this.loadCreatives();
    }
  }

  selectTimeslot(timeslot: Timeslot) {
    this.selectedTimeslot = timeslot;
  }

  loadCreatives() {
    this.subscriptions.add(
      this.appService.getCreatives()
        .subscribe(value => this.creatives = value)
    )
  }

  setCreatingCreative(state: boolean) {
    this.creating = state;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  // todo: animated progress needed
  uploadImage() {
    this.isSaving = true;
    this.progressService.showProgressPopup();
    this.appService.saveCreative(this.creativeName, this.creativeDescription, this.filename, this.file)
      .pipe(
        finalize(() => this.progressService.closeProgressPopup())
      )
      .subscribe(event2 => {
        console.log('event', event2);
        if (event2.type === HttpEventType.UploadProgress) {
          // console.log('loaded ', event2.loaded, 'from', event2.total, ' percent: ', Math.round(event2.loaded / event2.total * 100), '%');
          if (event2.loaded !== event2.total) {
            this.progressService.setProgressData(`Uploading file... ${Math.round(event2.loaded / event2.total * 100)}%`);
          } else {
            this.progressService.setProgressData('Saving file in NFT.Storage...')
          }
        } else if (event2.type === HttpEventType.Response) {
          /** maybe, show modal form or notifier **/
          this.progressService.setProgressData('Receiving response from server...');
          if (event2.body?.data) {
            this.creatives = event2.body?.data;
            this.creating = false;
            this.creativeName = '';
            this.creativeDescription = '';
            this.clearFile();
            /** id is increment number, for uuid response body must be changed **/
            this.selectedCreativeId = Math.max.apply(Math, this.creatives.map(function(o) { return o.id }));
            this.makeCreative();
          }
        }
        this.isSaving = false;
      }, (error: HttpErrorResponse) => {
        if (error.status === 415) {
          /* Unsupported media file */
          alert('Unsupported media file');
        } else {
          console.log(error);
        }
        this.progressService.setProgressData(`Saving creative failed: ${error.statusText}`);
        this.isSaving = false;
      });
  }

  fileChangeEvent(event: any) {
    let file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    const pattern = /webm-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
    this.filename = file.name;
  }

  _handleReaderLoaded(event: any) {
    let reader = event.target;
    this.file = reader.result
      .replace("data:", "")
      .replace(/^.+,/, "");
  }

  clearFile() {
    this.filename = '';
    this.file = null;
  }

   makeCreative() {
    const selectedCreative = this.creatives.find(c => c.id === this.selectedCreativeId);
    if (selectedCreative) {
      this.nearService.make_creative(selectedCreative.name, selectedCreative.url, selectedCreative.nft_ref)
        .then(result => console.log(result));
    }
  }
}
