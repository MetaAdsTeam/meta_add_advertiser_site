import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatLuxonDateModule} from '@angular/material-luxon-adapter';
import {MatSelectModule} from '@angular/material/select';

const modules = [
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatDialogModule,
  MatDatepickerModule,
  MatLuxonDateModule,
  MatSelectModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule {
}
