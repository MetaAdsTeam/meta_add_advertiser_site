import {Component, OnDestroy, OnInit} from '@angular/core';
import {appVersion} from '../environments/app-version';
import {Subscription} from 'rxjs';
import {User} from './model/user.model';
import {AppService, AuthService, NearService} from './services';

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

  constructor(private appService: AppService,
              private authService: AuthService,
              private nearService: NearService) { }

  ngOnInit() {
    this.nearService.nearConnect().then(() => {
      this.appService.setSignIn();
    });

    this.subscriptions.add(
      this.appService.user$.subscribe(result => {
        this.user = result;
        console.log('user', this.user)
      })
    );
    /* just for test, remove */
    this.subscriptions.add(
      this.authService.serverLogin('admin', 'admin')
        .subscribe(value => this.authService.setToken(value))
    );
  }

  nearLogin() {
    this.subscriptions.add(
      this.appService.nearLogin()
        .subscribe(result => console.log('nearLogin', result))
    );
  }

  nearLogout() {
    this.appService.signOut();
    /* redirect action, maybe */

  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
