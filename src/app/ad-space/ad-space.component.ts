import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {AppService} from '../app.service';
import {User} from '../model/user.model';
import {Ad} from '../model/ad.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-ad-space',
  templateUrl: './ad-space.component.html',
  styleUrls: ['./ad-space.component.scss']
})
export class AdSpaceComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  user: User| null = null;
  ad: Ad | undefined;

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appService.user$.subscribe(value => this.user = value)
    );
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params =>
        this.subscriptions.add(
          this.appService.getAdById(params['id']).subscribe(value => this.ad = value)
        )
      )
    );
  }

  signIn() {
    if (!this.user) {
      this.appService.signIn();
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
