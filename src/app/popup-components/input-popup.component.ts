import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  template: `
    <div class="message">
      <span>{{message}}</span>
      <mat-form-field class="custom2-form-field" style="background: white; border-radius: 5px;" appearance="outline">
        <input matInput
               type="text"
               autocomplete="off"
               placeholder="Email" [(ngModel)]="inputValue">
        <button mat-flat-button tabindex="-1" matSuffix
                [mat-dialog-close]="inputValue">
          <mat-icon svgIcon="send"></mat-icon>
        </button>
      </mat-form-field>
    </div>
  `,
  styles: [`    
    .message {
      background: #2A2931;
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
        height: 54px;
        background: #3888FF;
        border-radius: 0 4px 4px 0;
        padding: 0 20px;
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
