import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
  name = new FormControl('');

  constructor(public dialogRef: MatDialogRef<ConnectComponent>) { }

  ngOnInit(): void {
  }


  connect() {
    console.log('secret', this.name.value);
  }

  close() {
    this.dialogRef.close('connected')
  }
}
