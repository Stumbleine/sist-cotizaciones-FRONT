import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormRequestComponent} from '../app/Pages/form-request/form-request.component';
const routes: Routes = [
  
  {path:'form-solicitud', component: FormRequestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
