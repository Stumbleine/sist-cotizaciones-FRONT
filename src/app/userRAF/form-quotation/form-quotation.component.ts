import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from 'src/app/services/request.service'
import { ActivatedRoute, Router } from '@angular/router';
import { DialogValidationSendComponent } from 'src/app/business/dialog-validation-send/dialog-validation-send.component';
import { SnackbarSendRequestComponent } from 'src/app/userRUG/snackbar-send-request/snackbar-send-request.component';
import { DialogValidationCancelComponent } from 'src/app/business/dialog-validation-cancel/dialog-validation-cancel.component';

export interface Item{
  quantity : number,
  unit : string,
  description : string,
  unitPrice : number,
  totalPrice : number,
}
const  Items=[
  {quantity: 1, unit: 'Hydrogen', description: 1.0079},
  {quantity: 1, unit: 'Hydrogen', description: 1.0079},
  {quantity: 1, unit: 'Hydrogen', description: 1.0079},
  {quantity: 1, unit: 'Hydrogen', description: 1.0079},
];

@Component({
  selector: 'app-form-quotation',
  templateUrl: './form-quotation.component.html',
  styleUrls: ['./form-quotation.component.css']
})
export class FormQuotationComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }
  priceQuotationDetail: Item[] = [];
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
    saveQuotation(quotation,formDirective1: FormGroupDirective){
      console.log(quotation);
        if(this.pressed){  
          quotation.total= this.getTotalCost();  
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
    this.router.navigate(['/req-content/:id/form-quotation']);
    window.location.reload();
  }
  

}
