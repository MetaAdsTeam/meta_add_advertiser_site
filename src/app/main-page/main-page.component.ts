import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {Ad} from '../model/ad.model';
import {AppService} from '../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  ads: Ad[] = [];
  selectedAd: Ad | null = null;
  signed: boolean = false;
  selectedAdFilter = 'all';

  constructor(private appService: AppService,
              private router: Router) { }

  ngOnInit(): void {
    this.loadAds();
    this.subscriptions.add(
      this.appService.signed$.subscribe(value => this.signed = value)
    );
  }

  selectAd(ad: Ad) {
    this.selectedAd = ad;
  }

  showMore(ad: Ad) {
    this.router.navigate([`/ad/${ad.id}`],)
  }

  loadAds(filter: string = 'all') {
    this.subscriptions.add(
      this.appService.getAds(filter).subscribe(value => {
        this.ads = value;
        this.selectedAdFilter = filter;
      })
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
