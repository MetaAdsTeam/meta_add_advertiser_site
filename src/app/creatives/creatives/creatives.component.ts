import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AppService, AuthService, PopupService} from '../../services/index';
import {Subscription} from 'rxjs';
import {Creative} from '../../model/index';
import {finalize, map} from 'rxjs/operators';
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
              private router: Router,
              private popupService: PopupService) { }

  ngOnInit() {
    this.loadCreatives();
  }

  loadCreatives() {
    this.loading = true;
    this.appService.getCreatives()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(value => {
        this.creatives = value.map(cr => {
          return {...cr, type: cr.url.substring(cr.url.lastIndexOf('.') + 1)}
        });
        this.filteredCreatives = this.creatives;
        console.log(this.creatives);
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
    alert('not ready')
  }

  goToDetails(id: number) {
    this.router.navigate([`/creatives/${id}`])
  }

  // todo: create modal
  newCreative() {
    this.popupService.popupNewCreative();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
