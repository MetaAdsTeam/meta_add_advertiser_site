import {Injectable} from '@angular/core';
import * as nearApi from 'near-api-js';
import {ConnectedWalletAccount, WalletConnection} from 'near-api-js/lib/wallet-account';
import {environment} from '../../environments/environment';
import {ConnectConfig} from 'near-api-js/lib/connect'
import {Contract, utils} from 'near-api-js';
import {DateTime} from 'luxon';

const { connect, keyStores } = nearApi;
const viewMethods = [
  'fetch_creative_by_id',
  'fetch_all_creatives',
  'fetch_all_presentations',
  'fetch_presentation_by_id',
  'fetch_adspot_by_id',
  'fetch_all_adspots'];

const changeMethods = [
  'make_creative',
  'do_agreement',
  'transfer_funds',
  'make_adspot'
];

interface ContractWithMethods extends Contract{
  make_creative?: any,
  fetch_creative_by_id?: any,
  fetch_all_creatives?: any,
  fetch_all_presentations?: any,
  fetch_presentation_by_id?: any,
  fetch_adspot_by_id?: any,
  fetch_all_adspots?: any,
  do_agreement?: any,
  transfer_funds?: any,
  make_adspot?: any
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
    // console.log('accObj', this.account);


    const methodOptions = {
      viewMethods: viewMethods,
      changeMethods: changeMethods
    };
    this.contract = new Contract(this.account, environment.near.contractId, methodOptions);
  }

  nearSignIn() {
    return this.wallet.requestSignIn(
      {contractId: environment.near.contractId, methodNames: viewMethods},
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
      // console.log('sign out');
      this.wallet.signOut();
    }
  }

  getAccountId(): any {
    return this.wallet.getAccountId()
  }

  async make_creative(creativeName: string, url: string, nftCid: string, creativeId: number) {
    await this.contract.make_creative({
      args: {
        name: creativeName,
        content: url,
        nft_cid: nftCid,
        creative_id: creativeId
      }
    });
  }

  /** working */
  fetchCreativeById(id: number): Promise<any> {
    return this.getViewFunction('fetch_creative_by_id', {id: id});
  }

  fetchAllCreatives(): Promise<any> {
    return this.getViewFunction('fetch_all_creatives');
  }

  fetchPresentationsById(id: number): Promise<any> {
    return this.getViewFunction('fetch_presentation_by_id', {id: id});
  }

  fetchAllPresentations(): Promise<any> {
    return this.getViewFunction('fetch_all_presentations');
  }

  getViewFunction(methodName: string, args?: any): Promise<any> {
    return this.account.viewFunction(environment.near.contractId, methodName, args)
  }
  /** record_id equal playbackid **/
  async do_agreement(playback_id: number, adId: number, creative_id: number, from_time: DateTime, to_time: DateTime, price: number): Promise<any> {
    const args = {
      playback_id: playback_id,
      adspot_id: adId,
      creative_id: creative_id,
      start_time: from_time.toSeconds(),
      end_time: to_time.toSeconds()
    };
    await this.contract.do_agreement({
      args: args,
      accountId: this.getAccountId(),
      amount: utils.format.parseNearAmount(price.toString())
    });
  }
}
