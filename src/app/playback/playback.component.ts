import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {Playback} from '../model';
import {AppService} from '../services';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';

@Component({
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.scss']
})
export class PlaybackComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private id: number;
  playback: Playback;
  loading = false;

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
        this.loadPlayback();
      })
    );
  }

  loadPlayback() {
    this.loading = true;
    this.subscriptions.add(
      this.appService.getPlaybackById(this.id)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe(value => {
          this.playback = value;
        })
    );
  }

  showPlaceAd(id: number) {
    this.router.navigate([`/ad-space/adspot/${id}`, {showPlaceAd: true}]);
  }

  goToList() {
    this.router.navigate([`/ad-space`, {filter: 'my'}]);
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
