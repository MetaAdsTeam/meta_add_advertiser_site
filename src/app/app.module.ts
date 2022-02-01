import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MaterialModule} from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AdSpaceComponent} from './ad-space/ad-space.component';
import {ConnectComponent} from './connect/connect.component';
import {MainPageComponent} from './main-page/main-page.component';
import {AvatarComponent} from './avatar/avatar.component';
import {AuthGuard} from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AdSpaceComponent,
    ConnectComponent,
    AvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
