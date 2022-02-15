import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AppService, AuthService} from '../services';
import {Subscription} from 'rxjs';
import {Creative} from '../model';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-creatives',
  templateUrl: './creatives.component.html',
  styleUrls: ['./creatives.component.scss']
})
export class CreativesComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  search = new FormControl('');
  sortType: 'status' | 'id';
  creatives: Creative[];
  loading: boolean; /* not used */

  constructor(private appService: AppService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.subscriptions.add(
      this.authService.authorization$.subscribe(token => {
        if (token) {
          this.loadCreatives();
        }
      })
    );
  }

  loadCreatives() {
    this.loading = true;
    this.appService.getCreatives()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(value => this.creatives = value)
  }

  parseSearch(searchValue: string) {

  }

  sorting() { }

  deleteCreatives(cr: Creative) {

  }

  goToDetails(id: number) {
    this.router.navigate([`/creative/${id}`])
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
