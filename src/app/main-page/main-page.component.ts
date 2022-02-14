import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Adspot} from '../model';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {AppService, AuthService} from '../services';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  ads: Adspot[] = [];
  selectedAd: Adspot | null = null;
  signed: boolean = false;
  selectedAdFilter = 'all';
  loading = false; // not used

  constructor(private appService: AppService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appService.signed$.subscribe(value => this.signed = value)
    );
    this.subscriptions.add(
      this.authService.authorization$.subscribe(
        value => {
          if (value) {
            this.loadAds()
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  selectAd(ad: Adspot) {
    this.selectedAd = ad;
  }

  showMore(ad: Adspot) {
    this.router.navigate([`/ad/${ad.id}`],)
  }

  loadAds(filter: string = 'all') {
    this.loading = true;
    this.subscriptions.add(
      this.appService.getAds(filter)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(value => {
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
