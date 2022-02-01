import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {Ad} from '../model/ad.model';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConnectComponent} from '../connect/connect.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  ads: Ad[] = [];
  selectedAd: Ad | null = null;
  signed: Boolean = false;
  dialogRef: any = null;

  constructor(private appService: AppService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.appService.getAds().subscribe(value => this.ads = value)
    );
    this.subscriptions.add(
      this.appService.signed$.subscribe(value => this.signed = value)
    )
  }

  login() {
    this.dialogRef = this.dialog.open(ConnectComponent, {
      width: '350px',
      minHeight: 200,
      maxHeight: '100%',
      disableClose: true,
      panelClass: 'custom-dialog-panel',
      backdropClass: 'modal-backdrop'
    });
    this.subscriptions.add(this.dialogRef.afterClosed()
      .subscribe(() => {
        // if (result) {
          this.appService.signIn();
        //}
      })
    );
  }

  logout() {
    this.appService.signOut();
    /* redirect action, maybe */
  }

  selectAd(ad: Ad) {
    this.selectedAd = ad;
  }

  showMore(ad: Ad) {
    this.router.navigate([`/ad/${ad.id}`],)
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
