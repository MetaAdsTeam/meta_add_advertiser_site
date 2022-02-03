import { NgModule } from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MaterialModule} from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AdSpaceComponent} from './ad-space/ad-space.component';
import {ConnectComponent} from './connect/connect.component';
import {MainPageComponent} from './main-page/main-page.component';
import {AuthGuard} from './auth.guard';
import {MatIconRegistry} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {DescriptionComponent} from './ad-space/description.component';
import {HistoryComponent} from './ad-space/history.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {CustomHeader} from './ad-space/custom-header/calendar-custom-header';
import {DateFormatPipe} from './shared/date-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AdSpaceComponent,
    ConnectComponent,
    DescriptionComponent,
    HistoryComponent,
    CustomHeader,
    DateFormatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private sanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry) {
    this.matIconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/close.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'logout',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/logout.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'arrow2-left',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/arrow2-left.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'arrow2-right',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/arrow2-right.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'near',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/near.svg')
    );
  }
}
