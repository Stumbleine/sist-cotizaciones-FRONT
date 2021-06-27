import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './userRUG/home-page/home-page.component';
import { FormRequestComponent } from './userRUG/form-request/form-request.component';
import {HomePageRAFComponent} from './userRAF/home-page-raf/home-page-raf.component';
import {ReqContentComponent} from './userRAF/req-content/req-content.component';
import {FormQuotationComponent} from './userRAF/form-quotation/form-quotation.component';

import { FormQuotationBusinessComponent } from './business/form-quotation-business/form-quotation-business.component';
import {ErrorPageComponent} from './components/error-page/error-page.component'
import {QuotationContentComponent} from './userRAF/quotation-content/quotation-content.component'
import {ResponseFormComponent} from './components/response-form/response-form.component'
import {FilesComponent} from './components/file/files.component'
import { LoginComponent } from './components/login/login.component';
import { HomeAdminComponent } from './userAdmin/home-admin/home-admin.component';
const routes: Routes = [
  { path: 'home-raf', component:  HomePageRAFComponent},
  { path: 'home-rug', component:  HomePageComponent},
  { path: 'form-solicitud', component:  FormRequestComponent},
  
  {path: '', pathMatch: 'full', redirectTo: 'home-rug'},
  {path:'req-content/:id',component:ReqContentComponent},
  {path:'req-content/:idSR/form-quotation/:idQ',component:FormQuotationComponent},
  {path: 'cotizador/form-quotation/:idQ', component: FormQuotationBusinessComponent},
  {path: '', pathMatch: 'full', redirectTo: 'home-rug'},
  {path: 'req-content/:idSR/error', component:ErrorPageComponent },
  {path: 'error', component:ErrorPageComponent },
  {path: 'response-form', component:ResponseFormComponent}, 
  {path:'req-content/:idSR/quot-content/:quotID',component:QuotationContentComponent},
{ path: 'home-raf/file',component:FilesComponent},
{ path: 'login',component:LoginComponent},

{ path: 'home-admin',component:HomeAdminComponent}
 
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
