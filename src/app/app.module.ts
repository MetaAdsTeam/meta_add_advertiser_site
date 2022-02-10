import { NgModule } from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MaterialModule} from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AdSpaceComponent} from './ad-space/ad-space.component';
import {ConnectComponent} from './connect/connect.component';
import {MainPageComponent} from './main-page/main-page.component';
import {MatIconRegistry} from '@angular/material/icon';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DescriptionComponent, HistoryComponent} from './ad-space/components';
import {NgxEchartsModule} from 'ngx-echarts';
import {CustomHeader} from './ad-space/custom-header/calendar-custom-header';
import {DateFormatPipe} from './pipes';
import {AuthorizationInterceptor, NotAuthorizedInterceptor} from './interceptors';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {ProgressPopupComponent} from './progress-popup/progress-popup.component';
import {PlaceAdComponent} from './ad-space/place-ad/place-ad.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AdSpaceComponent,
    ConnectComponent,
    DescriptionComponent,
    HistoryComponent,
    CustomHeader,
    DateFormatPipe,
    ProgressPopupComponent,
    PlaceAdComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotAuthorizedInterceptor,
      multi: true
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'en-GB'
    },
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
    this.matIconRegistry.addSvgIcon(
      'eye',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/eye.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'upload',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/paper-plus.svg')
    );
  }
}
