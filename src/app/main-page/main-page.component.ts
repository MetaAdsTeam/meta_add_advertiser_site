import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Adspot, PlaybackBE} from '../model';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {AppService, PopupService} from '../services';

interface AdspotPreview {
  id: number,
  name: string,
  active: boolean,
  preview_thumb_url: string,
  spot_type: string,
  source: 'adspots' | 'playbacks'
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  ads: AdspotPreview[] = [];
  selectedAd: AdspotPreview | null = null;
  signed: boolean = false;
  selectedAdFilter = 'all';
  loading = false; // not used

  constructor(private appService: AppService,
              private router: Router,
              private popupService: PopupService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const filter = this.route.snapshot.paramMap.get('filter');
    this.loadAds(filter ? filter : 'all');
    this.subscriptions.add(
      this.appService.signed$.subscribe(value => this.signed = value)
    );
  }

  selectAd(ad: AdspotPreview) {
    this.selectedAd = ad;
  }

  showMore(ad: AdspotPreview) {
    if (ad.source === 'adspots') {
      this.router.navigate([`/ad-space/adspot/${ad.id}`])
    } else {
      this.router.navigate([`/ad-space/playback/${ad.id}`])
    }
  }

  loadAds(filter: string = 'all') {
    this.loading = true;
    this.selectedAdFilter = filter;
    if (filter === 'all') {
      this.subscriptions.add(
        this.appService.getAds()
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe((value: Adspot[]) => {
            this.ads = value.map(a => {
              return {
                id: a.id,
                name: a.name,
                active: a.active,
                preview_thumb_url: a.preview_thumb_url,
                spot_type: a.spot_type,
                source: 'adspots'
              }
            });
            this.selectedAdFilter = filter;
          })
      );
    } else if (filter === 'my') {
      this.subscriptions.add(
        this.appService.getPlaybacks()
          .pipe(
            finalize(() => this.loading = false)
          )
          .subscribe((value: PlaybackBE[]) => {
            this.ads = value.map(a => {
              return {
                id: a.id,
                name: a.adspot_name,
                active: true,
                preview_thumb_url: a.preview_thumb_url,
                spot_type: a.adspot_type_name,
                source: 'playbacks'
              }
            });
          })
      );
    } else {
      this.loading = false;
    }
  }

  notifyMe() {
    this.popupService.popupInput('You\'ll be the first to know', 'ok')
      .subscribe(value => console.log('input value', value))
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
