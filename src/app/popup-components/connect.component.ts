import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {AppService} from '../services';


@Component({
  selector: 'app-connect',
  template: `
    <div class="connect-container">
      <span class="mat-caption" style="margin-bottom: 32px; text-align: center">Connect your wallet to dive into MetaAds</span>
      <div class="connect-container__img">
        <img src="assets/images/near.svg"/>
      </div>
      <button mat-flat-button
              class="connect-container__button mat-primary"
              (click)="connect()">Connect</button>
    </div>
  `,
  styles: [`
    .connect-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      box-sizing: border-box;
      background: #2A2931;
      color: white;
      padding: 92px 127px 0 127px;

      &__button {
        margin: 40px 0;
        width: 196px;
        height: 62px;
      }

      &__img {
        width: 196px;
        height: 56px;
        background: #323137;
        display: flex;
        justify-content: center;
      }
    }
  `]
})
export class ConnectComponent implements OnInit {
  subscriptions = new Subscription();

  constructor(public dialogRef: MatDialogRef<ConnectComponent>,
              private appService: AppService) {
  }

  ngOnInit(): void {
  }

  connect() {
    this.subscriptions.add(
      this.appService.signInNear()
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
