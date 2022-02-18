import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({name: 'formatDate'})
export class DateFormatPipe implements PipeTransform {
  transform(date: DateTime, type: string = 'DDMMMM'): string {
    if (date) {
      if (type === 'DDMMMM') {
        return date.toLocaleString({day: 'numeric', month: 'long'});
      } else if (type === 'HH12MM') {
        return date.toFormat('hh:mm').replace(':', '.')
      } else if (type === 'SIMPLE') {
        return date.toLocaleString({ hour: 'numeric', minute: '2-digit', hour12: true })
      } else {
        return ''
      }
    }
    return '';
  }
}
