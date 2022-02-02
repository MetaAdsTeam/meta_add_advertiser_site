import {Component, OnDestroy, OnInit} from '@angular/core';
import {appVersion} from '../environments/app-version';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {ConnectComponent} from './connect/connect.component';
import {AppService} from './app.service';
import {User} from './model/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Meta-Add';
  version = appVersion;
  user: User | null = null;

  private subscriptions = new Subscription();

  constructor(private dialog: MatDialog,
              private appService: AppService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.appService.user$.subscribe(result => {
        this.user = result;
        console.log('user', this.user)
      })
    );

  }

  login() {
    this.subscriptions.add(
      this.appService.login()
        .subscribe(result => console.log('login', result))
    );
  }

  logout() {
    this.appService.signOut();
    /* redirect action, maybe */
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
