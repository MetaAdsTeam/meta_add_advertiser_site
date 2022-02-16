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
  filteredCreatives: Creative[];

  constructor(private appService: AppService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loadCreatives();
    /*
    this.subscriptions.add(
      this.authService.authorization$.subscribe(token => {
        console.log('token', token, this.authService.getToken());
        if (token) {
          this.loadCreatives();
        }
      })
    );
    */
  }

  loadCreatives() {
    this.loading = true;
    this.appService.getCreatives()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(value => {
        this.creatives = value;
        this.filteredCreatives = value;
      })
  }

  parseSearch(searchValue: string) {
    this.filteredCreatives = this.creatives.filter(cr => cr.name.toLowerCase().includes(searchValue.toLowerCase().trim()))
  }

  sorting() {
    if (this.sortType === 'id') {
      this.filteredCreatives = this.filteredCreatives.sort((a, b) => {
        return (a.id < b.id) ? 1 : -1;
      });
    } else if (this.sortType === 'status') {
      this.filteredCreatives = this.filteredCreatives.sort((a, b) => {
        return a.blockchain_ref ? -1 : 1;
      });
    }
  }

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
