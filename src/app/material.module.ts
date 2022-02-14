import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatLuxonDateModule} from '@angular/material-luxon-adapter';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';

const modules = [
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatDialogModule,
  MatDatepickerModule,
  MatLuxonDateModule,
  MatSelectModule,
  MatMenuModule,
  MatTooltipModule,
  MatListModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule {
}
