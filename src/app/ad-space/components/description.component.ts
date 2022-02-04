import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-description',
  template: `
    <div class="desc">
      <span class="mat-body-1">{{header}}</span>
      <span class="desc__body">{{body}}</span>
      <span class="desc__button mat-body-2" (click)="more()">More</span>
    </div>
  `,
  styles: [`
    .desc {
      display: grid;
      padding: 48px 56px 61px;
      
      &__button {
        cursor: pointer;
        color: #3888FF;
      }
      
      &__body {
        padding: 24px 0 32px;
      }
    }
  `]
})
export class DescriptionComponent {
  @Input() header: string = '';
  @Input() body: string = '';

  more() {
    console.log('unknown action');
  }
}
