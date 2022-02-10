import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ProgressPopupComponent} from '../progress-popup/progress-popup.component';

export interface ProgressData {
  close: boolean,
  data?: string
}

@Injectable({providedIn: 'root'})
export class ProgressService {
  private progressData = new BehaviorSubject<ProgressData | null>(null);
  progressData$ = this.progressData.asObservable();

  constructor(private dialog: MatDialog) { }

  private setData(close: boolean, data: string = '') {
    this.progressData.next({close, data})
  }

  setProgressData(data: string = '') {
    this.setData(false, data);
  }

  closeProgressPopup() {
    const timerId = setTimeout(() => {
      this.setData(true);
      clearTimeout(timerId);
    }, 1000);
  }

  showProgressPopup() {
    this.dialog.open(ProgressPopupComponent, {
      width: '592px',
      height: '418px',
      maxHeight: '100%',
      disableClose: true,
      backdropClass: 'modal-backdrop'
    });
  }
}
