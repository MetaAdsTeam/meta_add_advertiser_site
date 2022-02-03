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
