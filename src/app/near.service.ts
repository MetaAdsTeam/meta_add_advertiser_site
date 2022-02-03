import {Injectable} from '@angular/core';
import * as nearApi from 'near-api-js';
import {ConnectedWalletAccount} from 'near-api-js/lib/wallet-account';

const { connect, keyStores, WalletConnection } = nearApi;

@Injectable({providedIn: 'root'})
export class NearService {
  private keyStore = new keyStores.BrowserLocalStorageKeyStore();

  private config = {
    networkId: "testnet",
    keyStore: this.keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
    headers: {}
  };
  nearConnection: any;
  wallet: any;
  accountObj: ConnectedWalletAccount;

  async nearConnect() {
    this.nearConnection = await connect(this.config);
    this.wallet = new WalletConnection(this.nearConnection, 'MetaAdd');
    this.accountObj = this.wallet.account();
    console.log('accObj', this.accountObj);
  }

  nearSignIn() {
    this.wallet.requestSignIn(
      'trenger.testnet',
      'MetaAdd',
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

}
