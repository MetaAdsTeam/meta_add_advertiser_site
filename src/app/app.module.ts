import { NgModule } from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MaterialModule} from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AdSpaceComponent} from './ad-space/ad-space.component';
import {ConnectComponent} from './popup-components/connect.component';
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
import {AuthGuard} from './auth.guard';
import {ProgressPopupComponent} from './popup-components/progress-popup.component';
import {RegisteredComponent} from './ad-space/registered/registered.component';
import {CreativesComponent} from './creatives/creatives/creatives.component';
import {MessagePopupComponent} from './popup-components/message-popup.component';
import {CreativeDetailsComponent} from './creatives/creative-details/creative-details.component';
import {PlaceAdComponent} from './ad-space/place-ad/place-ad.component';
import {UnregisteredComponent} from './ad-space/unregistered/unregistered.component';
import {AuthService} from './services';
import {MyCreativesComponent} from './creatives/my-creatives.component';
import {NewCreativeComponent} from './creatives/new-creative/new-creative.component';
import {HomeComponent} from './main-page/home.component';
import {PlaybackComponent} from './playback/playback.component';
import {InputPopupComponent} from './popup-components/input-popup.component';
import {PublisherComponent} from './publisher/publisher.component';
import {BackofficeComponent} from './publisher/backoffice/backoffice.component';

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
    PlaceAdComponent,
    RegisteredComponent,
    UnregisteredComponent,
    CreativesComponent,
    MessagePopupComponent,
    CreativeDetailsComponent,
    MyCreativesComponent,
    NewCreativeComponent,
    HomeComponent,
    PlaybackComponent,
    InputPopupComponent,
    PublisherComponent,
    BackofficeComponent
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
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private sanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry,
              private authService: AuthService) {

    this.authService.detectEthereumProvider();

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
    this.matIconRegistry.addSvgIcon(
      'search',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/search.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/delete.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'send',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/images/send.svg')
    );
  }
}
