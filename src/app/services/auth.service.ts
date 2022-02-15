import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';
import {environment} from '../../environments/environment';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import * as Web3Token from "web3-token";

const lsKeyMetaMask = 'web3token';

@Injectable({providedIn: 'root'})
export class AuthService {
  authorization = new BehaviorSubject<string>('');
  authorization$ = this.authorization.asObservable();

  api = environment.tornado_api;

  constructor() {}

  setToken(token: string) {
    localStorage.setItem(lsKeyMetaMask, token);
    this.authorization.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem(lsKeyMetaMask);
  }

  logOut() {
    localStorage.removeItem(lsKeyMetaMask);
  }

  get metaMaskSigned(): boolean {
    return !!this.getToken();
  }

  async loginMetaMask(login: string) {
    const ethereum: any = await detectEthereumProvider();
    const web3 = new Web3(ethereum);
    await ethereum.request({ method: 'eth_requestAccounts' });
    // getting address from which we will sign message
    var accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const token: any = await Web3Token.sign(
      (msg) => web3.eth.personal.sign(msg, address, ''),
      { expires_in: '1d', statement: login }
    );
    this.setToken(token);
    return address;
  }
}

