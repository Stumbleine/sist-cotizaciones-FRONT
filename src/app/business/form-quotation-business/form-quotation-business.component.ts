import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogValidationComponent } from 'src/app/userRUG/dialog-validation/dialog-validation.component';
import { SnackbarSendRequestComponent } from 'src/app/userRUG/snackbar-send-request/snackbar-send-request.component';
import {RequestService} from '../../services/request.service';
import { DialogValidationCancelComponent } from '../dialog-validation-cancel/dialog-validation-cancel.component';
import { DialogValidationSendComponent } from '../dialog-validation-send/dialog-validation-send.component';

export interface Item{
  quantity : number,
  unit : string,
  description : string,
  unitPrice : number,
  totalPrice : number,
}

export interface Quotation{
  wayOfPayment: string,
    garantyTerm:String,
    deliveryTerm:string,
    offValidation: number,
    total: string,
    priceQuotationDetail: Item[],
}

@Component({
  selector: 'app-form-quotation-business',
  templateUrl: './form-quotation-business.component.html',
  styleUrls: ['./form-quotation-business.component.css']
})
export class FormQuotationBusinessComponent implements OnInit {
  priceQuotationDetail: Item[] = [];
  Quotation:Quotation;
  i=0;

  itemForm = this.formBuilder.group({
    quantity: ['',[Validators.required]],
    unit: ['',[Validators.required]],
    description: ['',[Validators.required]],
    unitPrice:['',[Validators.required]],
    totalPrice:['',]
  });

  quotationForm = this.formBuilder.group({
      wayOfPayment: ['',[Validators.required]],
      garantyTerm:['',],
      deliveryTerm:['',Validators.required],
      offValidation: ['',],
      total: ['',],
      priceQuotationDetail: [this.priceQuotationDetail,],
  });

  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description','unitPrice','totalPrice'];
  dataSource =  new MatTableDataSource<Item>([]);
  columnas=[
    
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"},
    {titulo:"PRECIO UNIT." ,name: "unitPrice"},
    
  ];
  public items:Item[]=[];
  ngOnInit(): void {
    this.loadDataBusiness();
  }
  pressed:boolean;

  refresh() {
    this.dataSource.data = this.priceQuotationDetail;
} 

  saveItem(value,formDirective: FormGroupDirective){
      this.pressed=true;
      this.priceQuotationDetail[this.i]=value;
      this.priceQuotationDetail[this.i].totalPrice=this.priceQuotationDetail[this.i].quantity * this.priceQuotationDetail[this.i].unitPrice;
      this.i++;
      console.log(this.priceQuotationDetail);
      formDirective.resetForm();
      this.itemForm.reset();
      this.refresh();

    }
    public dataBusiness:any;
    public id:number;
    nro=3;

    loadDataBusiness(){
      this.RequestService.get('http://localhost:8080/api/quotation/getIdOfNewQuotation')
      .subscribe(r=>{
        console.log(r);
        this.dataBusiness = r;
        this.id =this.dataBusiness.idPriceQuotation;
      })
    }
  saveQuotation(quotation,formDirective1: FormGroupDirective){
    this.Quotation=quotation;
    console.log(quotation);
      if(this.pressed){  
        quotation.total= this.getTotalCost();  
       // this.RequestService.post('http://localhost:8080/api/quotation',quotation)
        this.RequestService.put('http://localhost:8080/api/quotation/updateQuotation',quotation)
          .subscribe( respuesta =>{
            console.log('Solicitud enviada!!');
            this.openSnackBar();
          })
          formDirective1.resetForm();
          this.quotationForm.reset();
          this.quotationForm.reset();
          this.quotationForm.get('wayOfPayment').setValue("");
          this.quotationForm.get('garantyTerm').setValue("");
          this.quotationForm.get('deliveryTerm').setValue("");
          this.quotationForm.get('offValidation').setValue("");
          this.quotationForm.get('total').setValue("");
          this.i=0;
          this.priceQuotationDetail=[];
          this.quotationForm.get('priceQuotationDetail').setValue(this.priceQuotationDetail);
          this.pressed=false;
          this.refresh();
          
      }
      else{
          console.log("Por lo menos un item!!!")
          this.openDialog()
      };
}
openDialog() {
  this.dialog.open(DialogValidationSendComponent);
}
openDialogCancel(){
  this.dialog.open(DialogValidationCancelComponent);
}
openSnackBar() {
  this._snackBar.openFromComponent(SnackbarSendRequestComponent, {
    duration: 3000,
    panelClass:"blue-snackbar",
  });
}
getTotalCost() {
  return this.priceQuotationDetail.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
}

goForm(){
  this.router.navigate(['/cotizador/form-quotation']);
  window.location.reload();
}
}
