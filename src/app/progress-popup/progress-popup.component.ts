import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {ProgressService} from '../services/progress.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress-popup.component.html',
  styleUrls: ['./progress-popup.component.scss']
})
export class ProgressPopupComponent implements OnInit, OnDestroy {
  dynamicData: string | undefined;
  private subscriptions = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ProgressPopupComponent>,
              private progressService: ProgressService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.progressService.progressData$
        .subscribe(value => {
          if (value) {
            if (value.close) {
              this.dialogRef.close();
            }
            this.dynamicData = value.data;
          }
        })
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
