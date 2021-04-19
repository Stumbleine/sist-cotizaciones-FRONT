import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormRequestComponent } from './userRUG/form-request/form-request.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';

import { HomePageComponent } from './userRUG/home-page/home-page.component';
import { SummaryCardComponent } from './userRUG/summary-card/summary-card.component';
import { UserBarComponent } from './userRUG/user-bar/user-bar.component';
import { DialogRequestedComponent } from './userRUG/dialog-requested/dialog-requested.component';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'

import {MatCardModule} from '@angular/material/card'
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select'
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import { HomePageRAFComponent } from './userRAF/home-page-raf/home-page-raf.component'
import {HttpClientModule} from '@angular/common/http'
import {RequestService} from '../app/services/request.service';
import {CommonModule} from '@angular/common';
import { DialogValidationComponent } from './userRUG/dialog-validation/dialog-validation.component';
import {MatDialogModule} from '@angular/material/dialog';
//import { HomeRugComponent } from './respUnidadGasto/home-rug/home-rug.component';

@NgModule({
  declarations: [
    AppComponent,

    HomePageComponent,
    SummaryCardComponent,
    UserBarComponent,
    DialogRequestedComponent,
    HomePageRAFComponent,
    FormRequestComponent,
    DialogValidationComponent,
  ],
  imports: [
    HttpClientModule,

    CommonModule,     
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatToolbarModule, 
    MatIconModule,MatButtonModule, MatCardModule,MatProgressBarModule, MatFormFieldModule,
    MatSelectModule, MatDividerModule,MatGridListModule, 

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    ReactiveFormsModule

  ],
  providers: [    RequestService,],
  bootstrap: [AppComponent,FormRequestComponent,
  ]
})
export class AppModule { }
