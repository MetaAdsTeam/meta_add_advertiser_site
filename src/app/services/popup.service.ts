import {Injectable} from '@angular/core';
import {ConnectComponent} from '../popup-components/connect.component';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ProgressPopupComponent} from '../popup-components/progress-popup.component';
import {MessagePopupComponent} from '../popup-components/message-popup.component';
import {NewCreativeComponent} from '../creatives/new-creative/new-creative.component';
import {InputPopupComponent} from '../popup-components/input-popup.component';

@Injectable({providedIn: 'root'})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  popupNearLogin(): Observable<any> {
    return this.dialog.open(ConnectComponent, {
      width: '592px',
      height: '418px',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop'
    }).afterClosed();
  }

  popupProgress() {
    this.dialog.open(ProgressPopupComponent, {
      width: '592px',
      height: '418px',
      maxHeight: '100%',
      disableClose: true,
      backdropClass: 'modal-backdrop'
    });
  }

  popupMessage(message: string, button: string): Observable<any> {
    return this.dialog.open(MessagePopupComponent, {
      width: '592px',
      height: '418px',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      data: {message, button}
    }).afterClosed();
  }

  popupNewCreative() {
    this.dialog.open(NewCreativeComponent, {
      width: '592px',
      height: '468px',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop'
    });
  }

  popupInput(message: string, button: string): Observable<any> {
    return this.dialog.open(InputPopupComponent, {
      width: '592px',
      height: '418px',
      maxHeight: '100%',
      backdropClass: 'modal-backdrop',
      data: {message, button}
    }).afterClosed();
  }
}
