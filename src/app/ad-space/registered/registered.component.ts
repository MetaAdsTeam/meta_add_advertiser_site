import {Component, Input, OnInit} from '@angular/core';
import {Adspot, PlaceAdStorageModel, PayDataStorageModel} from '../../model';
import {StorageService} from '../../services';
import {ActivatedRoute} from '@angular/router';

type SelectedAddInfoType = 'desc' | 'history';

@Component({
  selector: 'app-ad-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['../ad-space.component.scss']
})
export class RegisteredComponent implements OnInit {
  @Input() ad: Adspot;

  selectedAddInfoType: SelectedAddInfoType = 'desc';
  isVisiblePlaceAd = false;
  savedPlaceAd: PlaceAdStorageModel | null;
  savedPayData: PayDataStorageModel | null;

  constructor(private storageService: StorageService,  private route: ActivatedRoute) { }

  ngOnInit() {
    const showPlaceAd = this.route.snapshot.paramMap.get('showPlaceAd');
    if (showPlaceAd) {
      this.showPlaceAd();
    }

    this.savedPlaceAd = this.storageService.getPlaceAdFromStorage();
    if (this.savedPlaceAd) {
      this.showPlaceAd();
      this.storageService.clearPlaceAdInStorage();
    }
    this.savedPayData = this.storageService.getPayDataFromStorage();
    if (this.savedPayData) {
      this.showPlaceAd();
      this.storageService.clearPayDataInStorage();
    }
  }

  selectAddInfoType() {
    this.selectedAddInfoType = this.selectedAddInfoType === 'desc' ? 'history' : 'desc';
  }

  showPlaceAd() {
    this.isVisiblePlaceAd = true;
  }
}
