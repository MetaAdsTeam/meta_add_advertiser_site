import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DateTime} from 'luxon';
import {CustomHeader} from '../custom-header/calendar-custom-header';
import {ComponentType} from '../ad-space.component';
import {
  Adspot,
  Creative,
  NftCreative,
  Timeslot,
  NftCreativeList,
  PlaceAdStorageModel,
  NftPlaybackList, NftPlayback
} from '../../model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {finalize, map} from 'rxjs/operators';
import {AppService, NearService, StorageService, ProgressService} from '../../services';
import {Subscription, Observable, of, forkJoin} from 'rxjs';
import {PayDataStorageModel} from '../../model/pay-data.storage.model';

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
  @Input() savedPayData: PayDataStorageModel | null;

  private subscriptions = new Subscription();
  selectedDate: DateTime = DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0}).setLocale('en');

  /* timeslot */
  timeslots: TimeslotsByType = {am: [], pm: []};
  selectedTimeslot: Timeslot;

  /* creative */
  creatives: Creative[];
  selectedCreativeId: number | undefined;
  creating = false;
  creativeName = '';
  creativeDescription = '';

  /* upload creative file */
  isSaving: boolean;
  file: any;
  filename: string;

  constructor(private appService: AppService,
              private nearService: NearService,
              private progressService: ProgressService,
              private storageService: StorageService) { }

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
    this.initSavedData(this.savedPlaceAd);
    if (this.selectedCreativeId) {
      this.markCreativeAsNft(this.selectedCreativeId);
      const selectedCreative = this.creatives.find(c => c.id === this.selectedCreativeId);
      if (selectedCreative && selectedCreative.blockchain_ref) {
        this.sendBlockchainRefToServer(selectedCreative.id, selectedCreative.blockchain_ref.toString());
      }
    }
  }

  initSavedPayData() {
    this.initSavedData(this.savedPayData);
    if (this.savedPayData && this.savedPayData.playbackId) {
      this.nearService.fetchAllPresentations().then((res: NftPlaybackList) => {
        const nft: NftPlayback[] = Object.values(res);
        for (let i = 0; i < nft.length; i++) {
          /** record_id equal playbackid **/
        }
      });
    }
  }

  private initSavedData(saved: PlaceAdStorageModel | PayDataStorageModel | null) {
    if (saved &&
      saved.accountId === this.nearService.getAccountId() &&
      saved.adId === this.ad.id ) {
      this.selectedDate = DateTime.fromISO(saved.dateISO);
      let timeslot: any;
      const from_time = saved.timeslotFromTimeISO;
      if (this.timeslots.am.length > 0) {
        timeslot = this.timeslots.am.find(t => +t.from_time === +DateTime.fromISO(from_time));
      }
      if (!timeslot && this.timeslots.pm.length > 0) {
        timeslot = this.timeslots.pm.find(t => +t.from_time === +DateTime.fromISO(from_time));
      }
      this.selectedTimeslot = timeslot;
      this.selectedCreativeId = saved.creativeId;
    }
  }

  getCustomHeader(): ComponentType<any> {
    return CustomHeader
  }

  selectDate(event: any) {
    console.log(event);
    this.loadTimeslots().subscribe(
      value => this.timeslots = value
    );
  }

  loadTimeslots(): Observable<TimeslotsByType> {
    console.log('ad', this.ad);
    if (this.ad) {
      const minAvailableTime = DateTime.now().plus({minutes: 3});
      const today = DateTime.now().set({hour: 0, minute: 0, second: 0, millisecond: 0});
      let maxAvailableTime: DateTime;
      if (+today === +this.selectedDate) {
        maxAvailableTime = DateTime.now().plus({hours: 2});
      } else {
        maxAvailableTime = this.selectedDate.plus({hours: 2});
      }

      return this.appService.getTimeslots(this.ad.id, this.selectedDate.toFormat('yyyy-MM-dd'))
          .pipe(
            map(value => {
              const timeslots: TimeslotsByType = {am: [], pm: []};
              timeslots.am = value.filter(v => v.from_time.hour < 12 && +v.from_time > +minAvailableTime && +v.from_time < +maxAvailableTime);
              timeslots.pm = value.filter(v => v.from_time.hour >= 12 && +v.from_time > +minAvailableTime && +v.from_time < +maxAvailableTime);
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
    return this.appService.getCreatives().pipe(
      map((cArr: Creative[]) => {
        return cArr.filter(c => c.blockchain_ref )
      })
    );
  }

  showCreatingPanel(state: boolean | undefined = undefined) {
    if (state) {
      this.creating = state;
      this.selectedCreativeId = undefined;
    } else {
      this.creating = !this.selectedCreativeId;
    }
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
            // this.creating = false;
            this.showCreatingPanel(false);
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
      this.storageService.savePlaceAdToStorage({
        accountId: this.nearService.getAccountId(),
        adId: this.ad.id,
        creativeId: this.selectedCreativeId!,
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

  setPlaybackBlockchainInfo(playbackId: number) {
    /** call backend **/
  }

  pay() {
    const creative = this.creatives.find(c => c.id === this.selectedCreativeId);
    let blockchainRef = '';
    if (creative && creative.blockchain_ref) {
      blockchainRef = creative.blockchain_ref.toString();
    }
    if (blockchainRef) {
      this.appService.pay({
        adspot_id: this.ad.id,
        creative_id: this.selectedCreativeId!,
        from_time: this.selectedTimeslot.from_time.toISO(),
        to_time: this.selectedTimeslot.to_time.toISO(),
        play_price: this.ad.price
        })
        .subscribe(value => {
          /** save data to storage **/
          this.storageService.savePayDataToStorage({
            accountId: this.nearService.getAccountId(),
            adId: this.ad.id,
            dateISO: this.selectedDate.toISO(),
            timeslotFromTimeISO: this.selectedTimeslot.from_time.toISO(),
            creativeId: this.selectedCreativeId!,
            playbackId: value.id
          });

          this.nearService.do_agreement(
            value.id,
            this.ad.id,
            +blockchainRef,
            this.selectedTimeslot.from_time,
            this.selectedTimeslot.to_time,
            'trenger.testnet' // for test use this.ad.publisher - near accountid
          ).then(
            res => console.log(res),
            err => {
              alert(`do_agreement error: ${err}`);
              this.storageService.clearPayDataInStorage();
            });
        });
    } else {
      alert('Creative not in blockchain');
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
