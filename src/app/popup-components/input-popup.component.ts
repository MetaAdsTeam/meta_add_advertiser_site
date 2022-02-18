import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  template: `
    <div class="message">
      <span>{{message}}</span>
      <mat-form-field class="custom-form-field" appearance="outline">
        <input matInput
               type="text"
               autocomplete="off"
               placeholder="Email" [(ngModel)]="inputValue">
      </mat-form-field>
      <button mat-raised-button [mat-dialog-close]="inputValue">{{ button }}</button>
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
export class InputPopupComponent {
  message: string;
  button: string;
  inputValue: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
    this.button = data.button;
  }

}
