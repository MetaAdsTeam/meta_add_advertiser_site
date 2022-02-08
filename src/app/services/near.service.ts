import {Injectable} from '@angular/core';
import * as nearApi from 'near-api-js';
import {ConnectedWalletAccount, WalletConnection} from 'near-api-js/lib/wallet-account';
import {environment} from '../../environments/environment';
import {AccountBalance} from 'near-api-js/lib/account';
import {ConnectConfig} from 'near-api-js/lib/connect'
import {Contract, utils} from 'near-api-js';

const { connect, keyStores } = nearApi;

interface ContractWithMethods extends Contract{
  nft_tokens_for_owner?: any,
  nft_mint?: any,
  nft_token?: any
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
      viewMethods: ['nft_tokens_for_owner', 'nft_token'],
      changeMethods: ['nft_mint']
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

  async nearSubmit() {
    const tokenId = 'token_' + Math.random().toString(36).substr(2, 9);
    await this.contract.nft_mint({
      meta: 'Sign contract',
      callbackUrl: document.location.href,
      args: {
        token_id: tokenId,
        metadata: {
          title: `NFT Token: ${tokenId}`,
          description: 'NFT Token with WebData',
          media: 'https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif'
        },
        receiver_id: environment.near.accountId,
        webdata: {
          uri: 'https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif'
        }
      },
      amount: utils.format.parseNearAmount('0.1')
    });
  }

  /** not working: process is not defined **/
  getNftTokens(): Promise<any> {
    return this.contract.nft_tokens_for_owner({account_id: environment.near.contractId, limit: 10})
  }

}
