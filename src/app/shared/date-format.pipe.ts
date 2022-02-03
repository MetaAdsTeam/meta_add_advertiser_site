import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({name: 'formatDate'})
export class DateFormatPipe implements PipeTransform {
  transform(date: DateTime): string {
    if (date) {
      return date.toLocaleString({ day: 'numeric', month: 'long' });
    }
    return '';
  }
}
