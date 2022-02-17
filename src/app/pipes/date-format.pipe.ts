import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({name: 'formatDate'})
export class DateFormatPipe implements PipeTransform {
  transform(date: DateTime, type: string = 'DDMMMM'): string {
    if (date) {
      if (type === 'DDMMMM') {
        return date.toLocaleString({day: 'numeric', month: 'long'});
      } else if (type === 'HH12MM') {
        return date.toFormat('hh:mm')
      } else {
        return ''
      }
    }
    return '';
  }
}
