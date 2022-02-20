import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-description',
  template: `
    <div class="desc">
      <h4 class="desc__title">{{header}}</h4>
      <div class="desc__body">{{body}}</div>
      <!-- a [href]="link" target="_blank" class="desc__link">View jump link</a -->
      <a *ngIf="link" [href]="link" target="_blank" class="desc__link">More</a>
      <!-- button class="desc__button" (click)="more()">More</button -->
    </div>
  `,
  styles: [`
  .desc {
    padding: 0;

    &__title {
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: 110%;
      letter-spacing: -1px;
      color: #ffffff;
      margin: 0;
      margin-bottom: 24px;
    }
    &__body {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      color: #ffffff;
      margin-bottom: 16px;
    }
    &__button {
      margin-top: calc(32px - 16px);
      font-style: normal;
      font-weight: 800;
      font-size: 18px;
      line-height: 110%;
      letter-spacing: -0.7px;
      text-decoration-line: underline;
      color: #3888FF;
      background-color: transparent;
      border: none;
      cursor: pointer;

      &:hover {
        text-decoration: none;
      }
    }
    &__link {
      font-size: 20px;
      font-weight: 800;
      text-decoration: none;
      color: #3888FF;
    }
  }
  `]
})
export class DescriptionComponent {
  @Input() header: string = '';
  @Input() body: string = '';
  @Input() link: string = '';

  more() {
    console.log('unknown action');
    alert('Unknown action!')
  }
}
