import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({name: 'formatDate'})
export class DateFormatPipe implements PipeTransform {
  transform(date: DateTime, type: string = 'DDMMMM'): string {
    if (date) {
      if (type === 'DDMMMM') {
        return date.toLocaleString({day: 'numeric', month: 'long'});
      } else if (type === 'HH12MM') {
        return date
          .toLocaleString({hour: 'numeric', hour12: true, minute: '2-digit'})
          .split(' ')[0]
          .replace(':', '.')
      } else {
        return ''
      }
    }
    return '';
  }
}
