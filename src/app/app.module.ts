import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomePageComponent } from './userRUG/home-page/home-page.component';
import { SummaryCardComponent } from './userRUG/summary-card/summary-card.component';
import { UserBarComponent } from './userRUG/user-bar/user-bar.component';
import { DialogRequestedComponent } from './userRUG/dialog-requested/dialog-requested.component';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatFormFieldModule} from '@angular/material/form-field'

import {MatSelectModule} from '@angular/material/select'
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import { HomePageRAFComponent } from './userRAF/home-page-raf/home-page-raf.component'

//import { HomeRugComponent } from './respUnidadGasto/home-rug/home-rug.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SummaryCardComponent,
    UserBarComponent,
    DialogRequestedComponent,
    HomePageRAFComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule, 
    MatIconModule,MatButtonModule, MatCardModule,MatProgressBarModule, MatFormFieldModule,
    MatSelectModule, MatDividerModule,MatGridListModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
