import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService, AuthService} from '../services';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Creative} from '../model';
import {finalize} from 'rxjs/operators';

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
  constructor(private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(params => {
        this.id = params['id'];
      })
    );
    this.subscriptions.add(
      this.authService.authorization$.subscribe(token => {
        if (token) {
          this.loadCreative();
        }
      })
    );
  }

  loadCreative() {
    this.loading = true;
    this.subscriptions.add(
      this.appService.getCreative(this.id)
        .pipe(
          finalize(() => this.loading = false)
        ).subscribe(value => this.creative = value)
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