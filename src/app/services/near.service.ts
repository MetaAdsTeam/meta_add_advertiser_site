import {Injectable} from '@angular/core';
import * as nearApi from 'near-api-js';
import {ConnectedWalletAccount, WalletConnection} from 'near-api-js/lib/wallet-account';
import {environment} from '../../environments/environment';
import {AccountBalance} from 'near-api-js/lib/account';
import {ConnectConfig} from 'near-api-js/lib/connect'
import { KeyPair} from 'near-api-js';

const { connect, keyStores } = nearApi;

const PRIVATE_KEY = 'testing';

@Injectable({providedIn: 'root'})
export class NearService {
  private keyStore = new keyStores.BrowserLocalStorageKeyStore();
  //private keyStore = new keyStores.InMemoryKeyStore();
  // private keyPair = KeyPair.fromString(PRIVATE_KEY);

  private config: ConnectConfig = {
    networkId: environment.near.networkId,
    nodeUrl: environment.near.nodeUrl,
    walletUrl: environment.near.walletUrl,
    helperUrl: environment.near.helperUrl,
    headers: {}
  };
  nearConnection: any;
  wallet: WalletConnection;
  account: ConnectedWalletAccount;

  async nearConnect() {
    // await this.keyStore.setKey("testnet", environment.near.accountId, this.keyPair);
    this.config = {...this.config, keyStore: this.keyStore};

    this.nearConnection = await connect(this.config);
    this.wallet = new WalletConnection(this.nearConnection, environment.near.app);
    this.account = this.wallet.account();
    console.log('accObj', this.account);
  }

  nearSignIn() {
    this.wallet.requestSignIn(
      environment.near.accountId,
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
  getBalance(): Promise<AccountBalance> {
    return this.account.getAccountBalance()
  }

  getAccountDetails(): Promise<any> {
    return this.account.getAccountDetails()
  }
}
