import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';
import {environment} from '../../environments/environment';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import * as Web3Token from "web3-token";

const lsKeyMetaMask = 'web3token';

@Injectable({providedIn: 'root'})
export class AuthService {
  private authorization = new BehaviorSubject<string>('');
  authorization$ = this.authorization.asObservable();
  private ethereum: any;

  api = environment.tornado_api;

  constructor() {}

  setToken(token: string) {
    localStorage.setItem(lsKeyMetaMask, token);
    this.authorization.next(token);
  }

  getToken(): string | null {
    let token = this.authorization.value;
    if (!token) {
      token = localStorage.getItem(lsKeyMetaMask) || '';
      this.authorization.next(token);
    }
    return token;
  }

  logOut() {
    localStorage.removeItem(lsKeyMetaMask);
  }

  async detectEthereumProvider() {
    this.ethereum = await detectEthereumProvider();
  }

  isEthereumProviderAvailable(): boolean {
    return !!this.ethereum;
  }

  get metaMaskSigned(): boolean {
    return !!this.getToken();
  }

  async loginMetaMask(login: string) {
    if (this.ethereum) {
      const web3 = new Web3(this.ethereum);
      await this.ethereum.request({ method: 'eth_requestAccounts' });
      // getting address from which we will sign message
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const token = await Web3Token.sign(
        msg => web3.eth.personal.sign(msg, address, ''),
        { expires_in: '1d', statement: login }
      );
      this.setToken(token);
      return address;
    } else {
      return ''
    }
  }
}

