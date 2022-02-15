import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdSpaceComponent} from './ad-space/ad-space.component';
import {MainPageComponent} from './main-page/main-page.component';
import {CreativesComponent} from './creatives/creatives.component';
import {CreativeDetailsComponent} from './creative-details/creative-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/ad-space',
    pathMatch: 'full'
  },
  {
    path: 'ad-space',
    component: MainPageComponent
  },
  {
    path: 'ad/:id',
    component: AdSpaceComponent
  },
  {
    path: 'creatives',
    component: CreativesComponent
  },
  {
    path: 'creative/:id',
    component: CreativeDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
