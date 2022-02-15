import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {MatCalendar} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'custom-header',
  styles: [
    `
    .custom-header {
      display: flex;
      align-items: center;
      // padding: 0.5em;
      margin-bottom: 27px;
    }

    .custom-header-label {
      font-style: normal;
      font-weight: 300;
      font-size: 15px;
      line-height: 110%;
      color: #FFFFFF;
      text-transform: capitalize;
    }
    button {
      background-color: transparent;
      border: none;
      cursor: pointer;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  `,
  ],
  template: `
    <div class="custom-header">
      <button (click)="previousClicked()">
        <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 1.5L1 6.5L6 11.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="custom-header-label">{{periodLabel}}</span>
      <button (click)="nextClicked()">
        <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1.5L6 6.5L1 11.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomHeader<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(private _calendar: MatCalendar<D>,
              private _dateAdapter: DateAdapter<D>,
              @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
              cdr: ChangeDetectorRef) {
    _calendar.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearA11yLabel)
      .toLocaleLowerCase();
  }

  previousClicked() {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
  }

  nextClicked() {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
  }
}
