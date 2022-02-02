import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdSpaceComponent} from './ad-space/ad-space.component';
import {MainPageComponent} from './main-page/main-page.component';

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
    component: AdSpaceComponent,
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
