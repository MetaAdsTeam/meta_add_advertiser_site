import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ProgressService} from '../services';

@Component({
  selector: 'app-progress',
  template: `
    <div class="progress">
      <span>{{ dynamicData }}</span>
    </div>
  `,
  styles: [`
    .progress {
      background: #2a2931;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: white;
        font-size: 30px;
      }
    }
  `]
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
