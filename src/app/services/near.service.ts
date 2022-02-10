import {Injectable} from '@angular/core';
import * as nearApi from 'near-api-js';
import {ConnectedWalletAccount, WalletConnection} from 'near-api-js/lib/wallet-account';
import {environment} from '../../environments/environment';
import {AccountBalance} from 'near-api-js/lib/account';
import {ConnectConfig} from 'near-api-js/lib/connect'
import {Contract, utils} from 'near-api-js';

const { connect, keyStores } = nearApi;

interface ContractWithMethods extends Contract{
  make_creative?: any,
  fetch_creative_by_id?: any,
  fetch_all_creatives?: any,
  do_agreement?: any
}

@Injectable({providedIn: 'root'})
export class NearService {
  private keyStore = new keyStores.BrowserLocalStorageKeyStore();

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
  contract: ContractWithMethods;

  async nearConnect() {
    this.config = {...this.config, keyStore: this.keyStore};

    this.nearConnection = await connect(this.config);
    this.wallet = new WalletConnection(this.nearConnection, environment.near.app);
    this.account = this.wallet.account();
    console.log('accObj', this.account);


    const methodOptions = {
      viewMethods: ['fetch_creative_by_id', 'fetch_all_creatives'],
      changeMethods: ['make_creative', 'do_agreement']
    };
    this.contract = new Contract(this.account, environment.near.contractId, methodOptions);
    console.log('contract', this.contract);

  }

  nearSignIn() {
    return this.wallet.requestSignIn(
      {contractId: environment.near.contractId, methodNames: ['addMessage']},
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

  getBalance(): Promise<AccountBalance> {
    return this.account.getAccountBalance()
  }

  getAccountDetails(): Promise<any> {
    return this.account.getAccountDetails()
  }

  getAccountState() {
    return this.account.state();
  }

  async make_creative(creativeName: string, url: string, nftCid: string) {
    await this.contract.make_creative({
      args: {
        name: creativeName,
        content: url,
        nft: nftCid
      }
    });
  }

}
