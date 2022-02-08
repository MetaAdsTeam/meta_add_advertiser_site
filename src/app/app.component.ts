import {Component, OnDestroy, OnInit} from '@angular/core';
import {appVersion} from '../environments/app-version';
import {Subscription} from 'rxjs';
import {AppService, AuthService, NearService} from './services';

type CurrentState = 'full' | 'minimized';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Meta-Add';
  version = appVersion;
  user: string = '';
  currentState: CurrentState = 'full';

  private subscriptions = new Subscription();

  constructor(private appService: AppService,
              private authService: AuthService,
              private nearService: NearService) { }

  ngOnInit() {
    this.nearService.nearConnect().then(() => {
      this.appService.setSignIn();
    });

    this.subscriptions.add(
      this.appService.nearAccountId$.subscribe(result => {
        this.user = result;
        console.log('user', result);
        if (result) {
          this.authService.tempLogin(result);
        } else {
          this.authService.setToken('');
        }
      })
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
  }

  resizeProfilePanel() {
    if (this.currentState === 'full') {
      /* minimize */
      this.currentState = 'minimized';
    } else {
      /* full */
      this.currentState = 'full'
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
