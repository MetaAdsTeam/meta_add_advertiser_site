import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {AppService} from '../services';


@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
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
