import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './userRUG/home-page/home-page.component';
import { FormRequestComponent } from './userRUG/form-request/form-request.component';
import {HomePageRAFComponent} from './userRAF/home-page-raf/home-page-raf.component';
import {ReqContentComponent} from './userRAF/req-content/req-content.component';
const routes: Routes = [
  { path: 'home-rug', component:  HomePageComponent},
  { path: 'form-solicitud', component:  FormRequestComponent},
  { path: 'home-raf', component:  HomePageRAFComponent},
  {path: '', pathMatch: 'full', redirectTo: 'home-rug'},
  {path:'req-content/:id',component:ReqContentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
