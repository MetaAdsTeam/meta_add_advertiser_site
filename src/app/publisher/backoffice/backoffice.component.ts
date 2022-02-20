import {Component, OnInit} from '@angular/core';
import {AppService} from '../../services';
import {Adspot} from '../../model';

@Component({
  selector: 'app-publisher-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.scss']
})
export class BackofficeComponent implements OnInit {
  adspots: Adspot[];
  selectedAd: Adspot;
  showNewAdPanel = false;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getAds().subscribe(value => this.adspots = value)
  }

  selectAd(ad: Adspot) {
    this.selectedAd = ad;
  }

  newAd() {
    this.showNewAdPanel = true;
  }
}
