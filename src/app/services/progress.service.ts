import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PopupService} from './popup.service';

export interface ProgressData {
  close: boolean,
  data?: string
}

@Injectable({providedIn: 'root'})
export class ProgressService {
  private progressData = new BehaviorSubject<ProgressData | null>(null);
  progressData$ = this.progressData.asObservable();

  constructor(private popupService: PopupService) { }

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
    this.popupService.popupProgress();
  }
}
