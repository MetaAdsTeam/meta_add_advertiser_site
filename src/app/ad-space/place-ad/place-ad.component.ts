import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DateTime} from 'luxon';
import {CustomHeader} from '../custom-header/calendar-custom-header';
import {ComponentType} from '../ad-space.component';
import {
  Adspot,
  Creative,
  NftCreative,
  Timeslot,
  PlaceAdStorageModel,
  NftPlayback,
  PayDataStorageModel
} from '../../model';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {finalize, map} from 'rxjs/operators';
import {AppService, NearService, StorageService, ProgressService, PopupService, AuthService} from '../../services';
import {Subscription, Observable, of} from 'rxjs';


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
  creativesInBlockchain: Creative[];
  /* upload creative file */
  isSaving: boolean;
  file: any;
  filename: string;
  fileError: string;

  constructor(private appService: AppService,
              private nearService: NearService,
              private progressService: ProgressService,
              private storageService: StorageService,
              private popupService: PopupService, private authService: AuthService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.loadCreatives()
        .subscribe(creatives => {
          this.creatives = creatives;
          this.creativesInBlockchain = creatives.filter(c => c.blockchain_ref);
          if (this.savedPlaceAd) {
            this.initSavedPlaceAd();
          } else if (this.savedPayData) {
            this.initSavedPayData();
          } else {
            this.subscriptions.add(
              this.loadTimeslots().subscribe(
                value => this.timeslots = value
              )
            );
          }
        })
    );
  }

  initSavedPlaceAd() {
    this.initSavedData(this.savedPlaceAd);
    if (this.selectedCreativeId) {
      const selectedCreative = this.creatives.find(c => c.id === this.selectedCreativeId);
      if (selectedCreative) {
        this.markCreativeAsNft(this.selectedCreativeId).then((res: NftCreative) => {
          if (res) {
            selectedCreative.blockchain_ref = res.creative_id;
            this.sendCreativeBlockchainRefToServer(selectedCreative.id, selectedCreative.blockchain_ref.toString());
          }
        });
      } else {
        this.selectedCreativeId = undefined;
      }
    }
  }

  initSavedPayData() {
    this.initSavedData(this.savedPayData);
    if (this.savedPayData && this.savedPayData.playbackId) {
      this.markPlaybackAsNft(this.savedPayData.playbackId)
        .then((res: NftPlayback) => {
          if (res) {
            this.subscriptions.add(
              this.sendPlaybackBlockchainInfoToServer(this.savedPayData!!.playbackId, res.status, res.playback_id)
                .subscribe(
                  () => {
                    this.popupService.popupMessage('Transaction successful', 'Got it!')
                  },
                  (error: HttpErrorResponse) => {
                    alert(`Error: ${error.statusText}`);
                  })
            )
          }
        });
    }
  }

  private initSavedData(saved: PlaceAdStorageModel | PayDataStorageModel | null) {
    if (saved &&
      saved.accountId === this.nearService.getAccountId() &&
      saved.adId === this.ad.id ) {
      this.selectedDate = DateTime.fromISO(saved.dateISO);
      this.subscriptions.add(
        this.loadTimeslots()
          .subscribe(value => {
            this.timeslots = value;
            let timeslot: any;
            const from_time = saved.timeslotFromTimeISO;
            if (this.timeslots.am.length > 0) {
              timeslot = this.timeslots.am.find(t => +t.from_time === +DateTime.fromISO(from_time));
            }
            if (!timeslot && this.timeslots.pm.length > 0) {
              timeslot = this.timeslots.pm.find(t => +t.from_time === +DateTime.fromISO(from_time));
            }
            this.selectedTimeslot = timeslot;
          })
      );
      this.selectedCreativeId = saved.creativeId;
    }
  }

  getCustomHeader(): ComponentType<any> {
    return CustomHeader
  }

  selectDate(event: any) {
    this.loadTimeslots().subscribe(
      value => this.timeslots = value
    );
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

      return this.appService.getTimeslots(this.ad.id, this.selectedDate.toISO())
          .pipe(
            map((value: Timeslot[]) => {
              const timeslots: TimeslotsByType = {am: [], pm: []};
              timeslots.am = value.filter(v => v.from_time.hour < 12 && +v.from_time > +minAvailableTime && +v.from_time < +maxAvailableTime);
              timeslots.pm = value.filter(v => v.from_time.hour >= 12 && +v.from_time > +minAvailableTime && +v.from_time < +maxAvailableTime);

              // timeslots.am = value.filter(v => v.from_time.hour < 12);
              // timeslots.pm = value.filter(v => v.from_time.hour >= 12);
              return timeslots;
            })
          )
    }
    return of({am: [], pm: []});
  }

  selectTimeslot(timeslot: Timeslot) {
    console.log('timeslot', timeslot);
    if (!timeslot.locked) {
      this.selectedTimeslot = timeslot;
    }
  }

  loadCreatives(): Observable<Creative[]> {
    return this.appService.getCreatives();
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
    this.fileError = '';
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
          this.fileError = 'Unsupported media file';
        } else {
          console.log(error);
        }
        this.progressService.setProgressData(`Saving creative failed: ${error.statusText}`);
        this.isSaving = false;
      });
  }

  fileChangeEvent(event: any) {
    this.fileError = '';
    let file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    const pattern = /webm-*|image/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.fileError = 'Invalid format';
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

  markCreativeAsNft(creativeId: number): Promise<any> {
    return this.nearService.fetchCreativeById(creativeId);
  }

  sendCreativeBlockchainRefToServer(creativeId: number, blockchainRef: string) {
    this.appService.markCreativeAsNft(creativeId, blockchainRef)
      .subscribe(() => {
        this.subscriptions.add(
          this.loadCreatives()
            .subscribe(creatives => {
              this.creatives = creatives;
              this.creativesInBlockchain = creatives.filter(c => c.blockchain_ref)
            })
        );
      });
  }

  sendPlaybackBlockchainInfoToServer(playbackId: number, status: string, smartContract: number): Observable<any> {
    return this.appService.markPlaybackAsNft(playbackId, status, smartContract)
  }

  markPlaybackAsNft(playbackId: number): Promise<any> {
    return this.nearService.fetchPresentationsById(playbackId);
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
        from_time: this.selectedTimeslot.from_time.toUTC().toISO({includeOffset: false}),
        to_time: this.selectedTimeslot.to_time.toUTC().toISO({includeOffset: false}),
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
          /** create mint **/
          this.nearService.do_agreement(
            value.id,
            this.ad.id,
            +blockchainRef,
            DateTime.fromISO(this.selectedTimeslot.from_time.toUTC().toISO({includeOffset: false}), {zone: 'utc'}),
            // this.selectedTimeslot.from_time,
            DateTime.fromISO(this.selectedTimeslot.to_time.toUTC().toISO({includeOffset: false}), {zone: 'utc'}),
            // this.selectedTimeslot.to_time,
            this.ad.price
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

  /** test **/
  test() {

  }

  mark() {
    if (this.selectedCreativeId) {
      const selectedCreative = this.creatives.find(c => c.id === this.selectedCreativeId);
      console.log('selectedCreative',  selectedCreative);
      if (selectedCreative) {
        this.markCreativeAsNft(this.selectedCreativeId).then((res: NftCreative) => {
          console.log('res', res);
          if (res) {
            selectedCreative.blockchain_ref = res.creative_id;
            this.sendCreativeBlockchainRefToServer(selectedCreative.id, selectedCreative.blockchain_ref.toString());
          }
        });
      } else {
        this.selectedCreativeId = undefined;
      }
    }
  }

}
