import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {AppService} from '../app.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {NearService} from '../near.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
  subscriptions = new Subscription();

  constructor(public dialogRef: MatDialogRef<ConnectComponent>,
              private nearService: NearService,
              private appService: AppService) {
  }

  ngOnInit(): void {
  }


  connect() {
    this.subscriptions.add(
      this.appService.signIn()
        .subscribe((result) => {
          this.close(result)
        },
          (error: HttpErrorResponse) => {
              console.log('error', error)
          }
      ));
  }



  close(result: boolean = false) {
    this.dialogRef.close(result)
  }
}
  /****

   import * as nearAPI from "near-api-js";



}



   /**
   let near = await nearApi.connect({
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      // helperUrl: "https://helper.testnet.near.org",
      // explorerUrl: "https://explorer.testnet.near.org",
      networkId: 'testnet',
      keyStore: new nearApi.BrowserLocalStorageKeyStore(window.localStorage, 'meta-add'),
      headers: {}
    });
   /**
   // Connect to user's wallet
   const walletConnection = new nearApi.WalletConnection(near, 'meta-add');
   let account;
   if (walletConnection.isSignedIn()) {
      // Logged in account, can write as user signed up through wallet
      account = walletConnection.account();
      // connect to a NEAR smart contract
      const contract = new nearApi.Contract(account, 'near.test.contract', {
        viewMethods: [],
        changeMethods: []
      });
    } else {
      // Contract account, normally only gonna work in read only mode
      account = new nearApi.Account(near.connection, 'near.test.contract');
    }
   console.log('near account', account);


   function updateUI() {
  if (!window.walletAccount.getAccountId()) {
    Array.from(document.querySelectorAll('.sign-in')).map(it => it.style = 'display: block;');
  } else {
    Array.from(document.querySelectorAll('.after-sign-in')).map(it => it.style = 'display: block;');
    contract.getCounter().then(count => {
      document.querySelector('#show').classList.replace('loader','number');
      document.querySelector('#show').innerText = count == undefined ? 'calculating...' : count;
      document.querySelector('#left').classList.toggle('eye');
      document.querySelectorAll('button').forEach(button => button.disabled = false);
      if (count >= 0) {
        document.querySelector('.mouth').classList.replace('cry','smile');
      }else {
        document.querySelector('.mouth').classList.replace('smile','cry');
      }
      if (count > 20 || count < -20) {
        document.querySelector('.tongue').style.display = 'block';
      }else {
        document.querySelector('.tongue').style.display = 'none';
      }
    });
  }
}

   // counter method
   let value = 1;

   document.querySelector('#plus').addEventListener('click', ()=>{
  document.querySelectorAll('button').forEach(button => button.disabled = true);
  document.querySelector('#show').classList.replace('number','loader');
  document.querySelector('#show').innerText = '';
  contract.incrementCounter({value}).then(updateUI);
});
   document.querySelector('#minus').addEventListener('click', ()=>{
  document.querySelectorAll('button').forEach(button => button.disabled = true);
  document.querySelector('#show').classList.replace('number','loader');
  document.querySelector('#show').innerText = '';
  contract.decrementCounter({value}).then(updateUI);
});
   document.querySelector('#a').addEventListener('click', ()=>{
  document.querySelectorAll('button').forEach(button => button.disabled = true);
  document.querySelector('#show').classList.replace('number','loader');
  document.querySelector('#show').innerText = '';
  contract.resetCounter().then(updateUI);
});
   document.querySelector('#c').addEventListener('click', ()=>{
  document.querySelector('#left').classList.toggle('eye');
});
   document.querySelector('#b').addEventListener('click', ()=>{
  document.querySelector('#right').classList.toggle('eye');
});
   document.querySelector('#d').addEventListener('click', ()=>{
  document.querySelector('.dot').classList.toggle('on');
  if (document.querySelector('.dot').classList.contains('on')) {
    value = 10;
  }else {
    value = 1;
  }
});
   // Log in user using NEAR Wallet on "Sign In" button click
   document.querySelector('.sign-in .btn').addEventListener('click', () => {
  walletAccount.requestSignIn(nearConfig.contractName, 'NEAR Counter Example');
});

   document.querySelector('.sign-out .btn').addEventListener('click', () => {
  walletAccount.signOut();
  // TODO: Move redirect to .signOut() ^^^
  window.location.replace(window.location.origin + window.location.pathname);
});

   window.nearInitPromise = connect()
   .then(updateUI)
   .catch(console.error);
   */

