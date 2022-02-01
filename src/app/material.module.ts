import {NgModule} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatNativeDateModule} from '@angular/material/core';

const modules = [
  // MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  // MatCardModule,
  MatInputModule,
  MatDialogModule,
  // MatDatepickerModule,
  // MatNativeDateModule,
  // MatTooltipModule,
  // MatDividerModule,
  // MatSelectModule,
  // MatRadioModule,
  // MatListModule,
  // MatSidenavModule,
  // MatStepperModule,
  // MatTabsModule,
  // MatCheckboxModule,
  // MatBottomSheetModule,
  // MatSnackBarModule,
  // ClipboardModule,
  // MatSlideToggleModule,
  // MatProgressBarModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule {
}
