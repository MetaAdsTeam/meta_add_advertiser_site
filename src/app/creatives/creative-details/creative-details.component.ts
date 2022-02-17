import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService, AuthService, NearService} from '../../services/index';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Creative} from '../../model/index';
import {finalize} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-creative-details',
  templateUrl: './creative-details.component.html',
  styleUrls: ['./creative-details.component.scss']
})
export class CreativeDetailsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  loading = false; /* no used */
  creative: Creative;
  private id: number;
  explorerNearUrl = `${environment.near.explorerUrl}/accounts`;

  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private nearService: NearService) {}

  ngOnInit() {
    this.explorerNearUrl = `${this.explorerNearUrl}/${this.nearService.getAccountId()}`;
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
      })
    );
    this.loadCreative();
  }

  loadCreative() {
    this.loading = true;
    this.subscriptions.add(
      this.appService.getCreative(this.id)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe(value => this.creative = {...value, type: value.url.substring(value.url.lastIndexOf('.') + 1)})
    );
  }

  returnBack() {
    this.router.navigate(['/creatives']);
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
