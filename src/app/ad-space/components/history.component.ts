import {Component} from '@angular/core';
import {EChartsOption} from 'echarts';

@Component({
  selector: 'app-history',
  template: `
    <div class="history">
      <div class="history__titles">
        <h5 class="">Total price</h5>
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
      padding: 0;
      height: 290px;

      &__titles {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        h5 {
          font-style: normal;
          font-weight: normal;
          font-size: 24px;
          line-height: 110%;
          /* or 26px */
          letter-spacing: -1px;
          color: #FFFFFF;
          margin: 0;
          padding: 0;
        }
      }

      &__type {
        display: flex;
        flex-wrap: wrap;
        span {
          font-style: normal;
          font-weight: normal;
          font-size: 15px;
          line-height: 110%;
          letter-spacing: -0.7px;
          color: #FFFFFF;

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
      width: 100%;
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
