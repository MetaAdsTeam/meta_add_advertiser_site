import {Component} from '@angular/core';
import {EChartsOption} from 'echarts';

@Component({
  selector: 'app-history',
  template: `
    <div class="history">
      <div class="history__titles">
        <span class="mat-body-1">Total price</span>
        <div class="history__type">
          <span>All time</span>
          <span>Month</span>
          <span>Week</span>
          <span>Day</span>
          <span>Custom date</span>
        </div>
      </div>
      <div echarts [options]="chartOption" class="price-chart"></div>
    </div>
  `,
  styles: [`
    .history {
      display: grid;
      padding: 48px 56px 61px;
      
      &__titles {
        display: flex;
        justify-content: space-between;
         max-width: 630px;
      }
       
      &__type {
        span {
          &:nth-child(even) {
            padding-right: 16px;
          }
          &:nth-child(odd) {
            padding-right: 16px;
          }
          &:last-child {
            padding-right: 0;
          }
        }
      } 
    }
    .price-chart {
      height: 350px;
      top: -20px;
      width: 700px;
    }
  `]
})
export class HistoryComponent {
  chartOption: EChartsOption = {
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        animationDelay: (idx) => idx * 10,
        smooth: true
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx) => idx * 5
  };
}
