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
      padding: 0.5em;
    }

    .custom-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }
  `,
  ],
  template: `
    <div class="custom-header">
      <button mat-icon-button (click)="previousClicked()">
        <mat-icon svgIcon="arrow2-left"></mat-icon>
      </button>
      <span class="custom-header-label">{{periodLabel}}</span>
      <button mat-icon-button (click)="nextClicked()">
        <mat-icon svgIcon="arrow2-right"></mat-icon>
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
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  previousClicked() {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
  }

  nextClicked() {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
  }
}
