import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormRequestComponent } from './userRUG/form-request/form-request.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card'
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select'
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http' 
import {RequestService} from '../app/services/request.service';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatStepperModule} from '@angular/material/stepper'
import {MatRadioModule} from '@angular/material/radio'
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule } from '@angular/material/list';
import {MatAutocompleteModule } from '@angular/material/autocomplete';
import {ClipboardModule} from '@angular/cdk/clipboard';

//componentes propios
import { HomePageComponent } from './userRUG/home-page/home-page.component';
import { SummaryCardComponent } from './userRUG/summary-card/summary-card.component';
import { UserBarComponent } from './userRUG/user-bar/user-bar.component';
import { DialogRequestedComponent } from './userRUG/dialog-requested/dialog-requested.component';
import { HomePageRAFComponent } from './userRAF/home-page-raf/home-page-raf.component'
import { DialogValidationComponent } from './userRUG/dialog-validation/dialog-validation.component';
import { SnackbarSendRequestComponent } from './userRUG/snackbar-send-request/snackbar-send-request.component';
import { ReqContentComponent } from './userRAF/req-content/req-content.component';
import { FormQuotationBusinessComponent } from './business/form-quotation-business/form-quotation-business.component';
import { DialogValidationSendComponent } from './business/dialog-validation-send/dialog-validation-send.component';
import { DialogValidationCancelComponent } from './business/dialog-validation-cancel/dialog-validation-cancel.component';
import { DgCreateCotComponent } from './userRAF/dg-create-cot/dg-create-cot.component'
import {SumCardRafComponent} from './userRAF/sum-card-raf/sum-card-raf.component'
import { FormQuotationComponent } from './userRAF/form-quotation/form-quotation.component';
import { QoatationCardComponent } from './userRAF/qoatation-card/qoatation-card.component';
import { ComparativeChartComponent } from './userRAF/comparative-chart/comparative-chart.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { DgChartValidationComponent } from './userRAF/dg-chart-validation/dg-chart-validation.component';
import { QuotationContentComponent } from './userRAF/quotation-content/quotation-content.component';
import { DialogGComponent } from './components/dialog-g/dialog-g.component';
import { ResponseFormComponent } from './components/response-form/response-form.component';
import { FilesComponent } from './components/file/files.component';

import { DgUploadComponent } from './components/dg-upload/dg-upload.component'
import { MaterialFileInputModule } from 'ngx-material-file-input';

import {PdfMakeWrapper} from 'pdfmake-wrapper';

import pdfFonts from "pdfmake/build/vfs_fonts";
import { DgCompanyRegisterComponent } from './business/dg-company-register/dg-company-register.component';
import { HomeAdminComponent } from './userAdmin/home-admin/home-admin.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterUserComponent } from './userAdmin/register-user/register-user.component';
import { RegisterRoleComponent } from './userAdmin/register-role/register-role.component';
import { RegisterUnidadComponent } from './userAdmin/register-unidad/register-unidad.component';
import { DgConfirmDeleteComponent } from './components/dg-confirm-delete/dg-confirm-delete.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CookieService } from 'ngx-cookie-service';
import { interceptorProvider, } from './security/jwt-interceptor.interceptor';
import {MatMenuModule} from '@angular/material/menu';
import { DgPrivelegesComponent } from './componets/dg-priveleges/dg-priveleges.component';
PdfMakeWrapper.setFonts(pdfFonts);
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
    SnackbarSendRequestComponent, 
    ReqContentComponent,
    DgCreateCotComponent,
    SumCardRafComponent,
    FormQuotationComponent,
    FormQuotationBusinessComponent,
    DialogValidationSendComponent,
    DialogValidationCancelComponent,
    QoatationCardComponent,
    ComparativeChartComponent,
    ErrorPageComponent,  
    DgChartValidationComponent, QuotationContentComponent, DialogGComponent, ResponseFormComponent, FilesComponent,
     DgUploadComponent,
     DgCompanyRegisterComponent,
     HomeAdminComponent,
     LoginComponent,
     RegisterUserComponent,
     RegisterRoleComponent,
     RegisterUnidadComponent,
     DgConfirmDeleteComponent,
     NavBarComponent,
     DgPrivelegesComponent,
     

  ],
  imports: [
    MaterialFileInputModule,

    HttpClientModule,
    CommonModule,     
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,MatTooltipModule,
    MatToolbarModule, 
    MatIconModule,MatButtonModule, MatCardModule,MatProgressBarModule, MatFormFieldModule,
    MatSelectModule, MatDividerModule,MatGridListModule, MatExpansionModule, MatDatepickerModule,
    MatStepperModule, MatRadioModule,FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,MatListModule,MatAutocompleteModule,ClipboardModule,MatMenuModule,

  ],
  providers: [RequestService,CookieService,interceptorProvider],
  bootstrap: [AppComponent,FormRequestComponent,
  ]
})
export class AppModule { }
