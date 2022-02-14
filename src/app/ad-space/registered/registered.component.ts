import {Component, Input} from '@angular/core';
import {Adspot} from '../../model';

type SelectedAddInfoType = 'desc' | 'history';

@Component({
  selector: 'app-ad-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['../ad-space.component.scss']
})
export class RegisteredComponent {
  @Input() ad: Adspot;
  selectedAddInfoType: SelectedAddInfoType = 'desc';
  isVisiblePlaceAd = false;

  selectAddInfoType() {
    this.selectedAddInfoType = this.selectedAddInfoType === 'desc' ? 'history' : 'desc';
  }

  showPlaceAd() {
    this.isVisiblePlaceAd = true;
  }
}
