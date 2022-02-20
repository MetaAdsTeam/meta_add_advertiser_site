import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdSpaceComponent} from './ad-space/ad-space.component';
import {MainPageComponent} from './main-page/main-page.component';
import {CreativesComponent} from './creatives/creatives/creatives.component';
import {CreativeDetailsComponent} from './creatives/creative-details/creative-details.component';
import {AuthGuard} from './auth.guard';
import {MyCreativesComponent} from './creatives/my-creatives.component';
import {HomeComponent} from './main-page/home.component';
import {PlaybackComponent} from './playback/playback.component';
import {PublisherComponent} from './publisher/publisher.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/ad-space',
    pathMatch: 'full'
  },
  {
    path: 'ad-space',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: MainPageComponent
      },
      {
        path: 'adspot/:id',
        component: AdSpaceComponent
      },
      {
        path: 'playback/:id',
        component: PlaybackComponent
      }
    ]
  },
  {
    path: 'creatives',
    component: MyCreativesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: CreativesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':id',
        component: CreativeDetailsComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'publisher',
    component: PublisherComponent
  },
  {
    path: '**',
    redirectTo: 'ad-space'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
