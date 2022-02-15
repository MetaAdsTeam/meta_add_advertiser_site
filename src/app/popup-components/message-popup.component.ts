import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  template: `
    <div class="message">
      <span>{{message}}</span>
      <button mat-raised-button mat-dialog-close>{{ button }}</button>
    </div>
  `,
  styles: [`
    .message {
      background: linear-gradient(90deg, #347CE8 -51.35%, #9409FB 141.72%);;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    span {
      color: white;
      font-size: 30px;
      font-weight: 800;
      font-family: 'Nexa', sans-serif;
      margin-bottom: 32px;
    }
    button {
      width: 177px;
      height: 56px;
      color: #347CE8;
    }
    }
  `]
})
export class MessagePopupComponent {
  message: string;
  button: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
    this.button = data.button;
  }
}
