import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DateTime} from 'luxon';
import {CustomHeader} from '../custom-header/calendar-custom-header';
import {ComponentType} from '../ad-space.component';
import {Adspot, Creative, NftCreative, Timeslot, NftCreativeList, PlaceAdStorageModel} from '../../model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {finalize, map} from 'rxjs/operators';
import {AppService, NearService} from '../../services';
import {ProgressService} from '../../services/progress.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {Observable} from 'rxjs/internal/Observable';
import {of} from 'rxjs/internal/observable/of';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';

interface TimeslotsByType {
  am: Timeslot[],
  pm: Timeslot[]
}

@Component({
  selector: 'app-place-ad',
  templateUrl: './place-ad.component.html',
  styleUrls: ['./place-ad.component.scss']
})
export class PlaceAdComponent implements OnInit, OnDestroy {
  @Input() ad: Adspot;
  @Input() savedPlaceAd: PlaceAdStorageModel | null;
  private subscriptions = new Subscription();
  selectedDate: DateTime = DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}).setLocale('en');

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
              private nearService: NearService,
              private progressService: ProgressService) { }

  ngOnInit() {
    this.subscriptions.add(
      forkJoin([this.loadTimeslots(), this.loadCreatives()])
        .pipe()
        .subscribe(([timeslots, creatives]) => {
          this.timeslots = timeslots;
          this.creatives = creatives;
          this.initSavedPlaceAd();
        })
    );
  }

  initSavedPlaceAd() {
    if (this.savedPlaceAd &&
        this.savedPlaceAd.accountId === this.nearService.getAccountId() &&
        this.savedPlaceAd.adId === this.ad.id) {
      this.selectedDate = DateTime.fromISO(this.savedPlaceAd.dateISO);
      let timeslot: any;
      const from_time = this.savedPlaceAd.timeslotFromTimeISO;
      if (this.timeslots.am.length > 0) {
        timeslot = this.timeslots.am.find(t => +t.from_time === +DateTime.fromISO(from_time));
      }
      if (!timeslot && this.timeslots.pm.length > 0) {
        timeslot = this.timeslots.pm.find(t => +t.from_time === +DateTime.fromISO(from_time));
      }
      this.selectedTimeslot = timeslot;
      this.selectedCreativeId = this.savedPlaceAd.creativeId;
      this.markCreativeAsNft(this.selectedCreativeId);
      const selectedCreative = this.creatives.find(c => c.id === this.selectedCreativeId);
      if (selectedCreative && selectedCreative.blockchain_ref) {
        this.sendBlockchainRefToServer(selectedCreative.id, selectedCreative.blockchain_ref.toString());
      }
    }
  }

  getCustomHeader(): ComponentType<any> {
    return CustomHeader
  }

  selectDate(event: any) {
    this.loadTimeslots();
  }

  loadTimeslots(): Observable<TimeslotsByType> {
    if (this.ad) {
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

      return this.appService.getTimeslots(this.ad.id, this.selectedDate.toFormat('yyyy-MM-dd'))
          .pipe(
            map(value => {
              const timeslots: TimeslotsByType = {am: [], pm: []};
              timeslots.am = value.filter(v => v.from_time.hour < 12 && v.from_time > minAvailableTime && v.from_time < maxAvailableTime);
              timeslots.pm = value.filter(v => v.from_time.hour >= 12 && v.from_time > minAvailableTime && v.from_time < maxAvailableTime);
              return timeslots;
            })
          )
    }
    return of({am: [], pm: []});
  }

  selectTimeslot(timeslot: Timeslot) {
    this.selectedTimeslot = timeslot;
  }

  loadCreatives(): Observable<Creative[]> {
    return this.appService.getCreatives();
  }

  setCreatingCreative(state: boolean) {
    this.creating = state;
  }

  uploadFile() {
    this.isSaving = true;
    this.progressService.showProgressPopup();
    this.appService.saveCreative(this.creativeName, this.creativeDescription, this.filename, this.file)
      .pipe(
        finalize(() => this.progressService.closeProgressPopup())
      )
      .subscribe(event2 => {
        // console.log('event', event2);
        if (event2.type === HttpEventType.UploadProgress) {
          // console.log('loaded ', event2.loaded, 'from', event2.total, ' percent: ', Math.round(event2.loaded / event2.total * 100), '%');
          if (event2.loaded !== event2.total) {
            this.progressService.setProgressData(`Uploading file... ${Math.round(event2.loaded / event2.total * 100)}%`);
          } else {
            this.progressService.setProgressData('Saving file in NFT.Storage...')
          }
        } else if (event2.type === HttpEventType.Response) {
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
      /** saving data to localStorage **/
      this.appService.savePlaceAdToStorage({
        accountId: this.nearService.getAccountId(),
        adId: this.ad.id,
        creativeId: this.selectedCreativeId,
        dateISO: this.selectedDate.toISO(),
        timeslotFromTimeISO: this.selectedTimeslot.from_time.toISO()
      });

      /** call contract method **/
      this.nearService.make_creative(selectedCreative.name, selectedCreative.url, selectedCreative.nft_ref, selectedCreative.id)
        .then(result => console.log(result));
    }
  }

  markCreativeAsNft(creativeId: number) {
    this.nearService.fetchAllCreatives().then((res: NftCreativeList) => {
      const rec: NftCreative[] = Object.values(res);
      const creative = this.creatives.find(c => c.id === creativeId);
      if (creative) {
        for (let i = 0; i < rec.length; i++) {
          if (rec[i].creative_ref === creativeId) {
            creative.blockchain_ref = rec[i].record_id;
            break;
          }
        }
      }
    });
  }

  sendBlockchainRefToServer(creativeId: number, blockchainRef: string) {
    this.appService.markCreativeAsNft(creativeId, blockchainRef)
      .subscribe(value => console.log(value));
  }

  pay() {


  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
