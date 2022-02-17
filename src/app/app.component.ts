import {Component, OnDestroy, OnInit} from '@angular/core';
import {appVersion} from '../environments/app-version';
import {Subscription} from 'rxjs';
import {AppService, AuthService, NearService, PopupService} from './services';
import {environment} from '../environments/environment';

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
  metaMaskSigned: boolean = false;
  currentState: CurrentState = 'full';
  signed: boolean = false;
  explorerNearUrl = `${environment.near.explorerUrl}/accounts`;
  walletNearUrl = `${environment.near.walletUrl}`;

  private subscriptions = new Subscription();

  constructor(private appService: AppService,
              private authService: AuthService,
              private nearService: NearService,
              private popupService: PopupService) {
    if (!this.authService.isEthereumProviderAvailable()) {
      this.popupService.popupMessage('Metamask extension is unavailable', 'Ok');
    }
  }

  ngOnInit() {
    this.nearService.nearConnect().then(() => {
      this.signed = this.appService.setSignIn();
    });

    this.subscriptions.add(
      this.appService.nearAccountId$.subscribe(result => {
        this.user = result;
        if (result) {
          this.explorerNearUrl = `${this.explorerNearUrl}/${result}`;
        }
      })
    );
    this.subscriptions.add(
      this.appService.signed$.subscribe(value => this.signed = value)
    );
    this.metaMaskSigned = this.authService.metaMaskSigned;
  }

  nearLogin() {
    this.subscriptions.add(
      this.appService.nearLogin()
        .subscribe(result => console.log('nearLogin', result))
    );
  }

  metaMaskLogin() {
    this.authService
      .loginMetaMask(this.user)
      .then((address) => {
        this.metaMaskSigned = !!address;
        this.appService.refreshLogin(this.logined);
        if (!address) this.popupService.popupMessage('Metamask extension is unavailable', 'Ok');
      })
      .catch((e) => {
        console.log(e);
        if (e.code = -32002) this.popupService.popupMessage('Please, sign in Metamask', 'Ok');
        this.metaMaskSigned = false;
      });
  }

  // todo: remove function
  get logined(): boolean {
    return this.metaMaskSigned && !!this.user
  }

  logout() {
    this.appService.signOut();
    this.metaMaskSigned = false;
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
