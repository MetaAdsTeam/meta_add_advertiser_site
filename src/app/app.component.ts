import {Component, OnInit} from '@angular/core';
import {appVersion} from '../environments/app-version';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {ConnectComponent} from './connect/connect.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Meta-Add';
  version = appVersion;
  connected = false;

  private subscriptions = new Subscription();

  constructor(private dialog: MatDialog) { }

  ngOnInit() {

  }

  connect() {
    const dialogRef = this.dialog.open(ConnectComponent, {
      width: '60%',
      height: '50%',
      disableClose: true,
      // panelClass: 'custom-dialog-panel',
      backdropClass: 'custom-backdrop',
      restoreFocus: false,
    });
    this.subscriptions.add(dialogRef.afterClosed()
      .subscribe(result => {
        this.connected = result
      })
    );
  }
}
