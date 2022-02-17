import {Component, Output} from '@angular/core';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {AppService, NearService, ProgressService, StorageService} from '../../services';
import {Creative} from '../../model';

@Component({
  selector: 'app-new-creative',
  templateUrl: './new-creative.component.html',
  styleUrls: ['./new-creative.component.scss']
})
export class NewCreativeComponent {
  creativeName: string;
  creativeDescription: string;
  filename: string;
  fileError: string;
  isSaving: boolean;
  private file: any;
  private creatives: Creative[];
  private selectedCreativeId: number | undefined;

  constructor(private progressService: ProgressService,
              private appService: AppService,
              private storageService: StorageService,
              private nearService: NearService) { }

  /*****/
  showCreatingPanel(state: boolean | undefined = undefined) {
    /*
    if (state) {
      this.creating = state;
      this.selectedCreativeId = undefined;
    } else {
      this.creating = !this.selectedCreativeId;
    }
    */
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
    console.log('file change', event);
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
    console.log('file', this.file, 'name', this.filename)
  }
  // todo: not enough for the same file
  clearFile() {
    this.filename = '';
    this.file = null;
  }

  makeCreative() {
    const selectedCreative = this.creatives.find(c => c.id === this.selectedCreativeId);
    if (selectedCreative) {
      /** saving data to localStorage **/
      this.storageService.saveNewCreativeToStorage(this.selectedCreativeId!!);

      /** call contract method **/
      this.nearService.make_creative(selectedCreative.name, selectedCreative.url, selectedCreative.nft_ref, selectedCreative.id)
        .then(result => console.log(result));
    }
  }
}
