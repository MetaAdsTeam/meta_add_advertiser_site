import {Injectable} from '@angular/core';
import * as nearApi from 'near-api-js';
import {ConnectedWalletAccount} from 'near-api-js/lib/wallet-account';
import {environment} from '../../environments/environment';

const { connect, keyStores, WalletConnection } = nearApi;

@Injectable({providedIn: 'root'})
export class NearService {
  private keyStore = new keyStores.BrowserLocalStorageKeyStore();

  private config = {
    networkId: environment.near.networkId,
    keyStore: this.keyStore,
    nodeUrl: environment.near.nodeUrl,
    walletUrl: environment.near.walletUrl,
    helperUrl: environment.near.helperUrl,
    explorerUrl: environment.near.explorerUrl,
    headers: {}
  };
  nearConnection: any;
  wallet: any;
  accountObj: ConnectedWalletAccount;

  async nearConnect() {
    this.nearConnection = await connect(this.config);
    this.wallet = new WalletConnection(this.nearConnection, environment.near.app);
    this.accountObj = this.wallet.account();
    console.log('accObj', this.accountObj);
  }

  nearSignIn() {
    this.wallet.requestSignIn(
      environment.near.contractId,
      environment.near.app,
      window.location.href);
  }

  isSignedIn(): boolean {
    if (this.wallet) {
      return this.wallet.isSignedIn();
    }
    return false;
  }

  nearSignOut() {
    if (this.wallet.isSignedIn()) {
      console.log('sign out');
      this.wallet.signOut();
    }
  }

  getAccountId(): any {
    return this.wallet.getAccountId()
  }

  // todo: getBalance, getTransactions

}
