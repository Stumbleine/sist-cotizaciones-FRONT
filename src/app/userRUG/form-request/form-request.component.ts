import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from '../../services/request.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogValidationComponent } from '../dialog-validation/dialog-validation.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { SnackbarSendRequestComponent } from '../snackbar-send-request/snackbar-send-request.component';
export interface Product{
  
  quantity: Number;
  unit: string;
  description:string;
}
interface Request{
  name: string,
    date:Date,
    status:String,
    type:string,
    estimatedAmount: number,
    justification: string,
    requestDetail: [],
}


@Component({
  selector: 'app-form-request',
  templateUrl: './form-request.component.html',
  styleUrls: ['./form-request.component.css']
})
export class FormRequestComponent implements OnInit {
 requestDetail: Product[] = [];
 i=0;
  currentDate=new Date;
  date= new DatePipe('en-US').transform(this.currentDate,'yyyy-MM-dd');
  user:any;
  productForm = this.formBuilder.group({
    quantity: ['',[Validators.required]],
    unit: ['',[Validators.required]],
    description: ['',[Validators.required]],
  });

  requestForm = this.formBuilder.group({
    initials: ['',],
    date:[this.date,],
    status: ['Pendiente',],
    type:['',],
    estimatedAmount: ['',[Validators.required]],
    justification: ['',[Validators.required]],
    requestDetail: [this.requestDetail,],
  });

  displayedColumns: string[]= ['quantity', 'unit', 'description'];
  dataSource = new MatTableDataSource<Product>([]);
  @ViewChild (MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getDataUser()
  }
  
  pressed:boolean;
  columns=[
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"}
  ];

  refresh() {
    this.dataSource.data = this.requestDetail;
} 

  saveProduct(value,formDirective: FormGroupDirective){
      //console.log(JSON.stringify(value))
      this.pressed=true;
      this.requestDetail[this.i]=value;
      this.i++;
      console.log(this.requestDetail);
      formDirective.resetForm();
      this.productForm.reset();
      this.refresh();

    }
    
  
  saveRequest(request,formDirective1: FormGroupDirective){
    Request=request;
    console.log(Request);
      if(this.pressed){  
          this.RequestService.post('http://localhost:8080/api/request/'+this.user.idUser,Request)
          .subscribe( respuesta =>{
            console.log('Solicitud enviada!!');
            this.openSnackBar();
          })
          formDirective1.resetForm();
          this.requestForm.reset();
          this.productForm.reset();
          this.requestForm.get('date').setValue(this.date);
          this.requestForm.get('status').setValue("Pendiente");
          this.requestForm.get('estimatedAmount').setValue("");
          this.requestForm.get('type').setValue("");
          this.requestForm.get('initials').setValue("");
          this.requestForm.get('justification').setValue("");
          this.i=0;
          this.requestDetail=[];
          this.requestForm.get('requestDetail').setValue(this.requestDetail);
          this.pressed=false;
          this.refresh();
          
      }
      else{
          console.log("Por lo menos un detalle!!!")
          this.openDialog()
      };
}
openDialog() {
  this.dialog.open(DialogValidationComponent);
}
openSnackBar() {
  this._snackBar.openFromComponent(SnackbarSendRequestComponent, {
    duration: 3000,
    panelClass:"blue-snackbar",
  });
}
getDataUser(){
  this.user=JSON.parse(localStorage.getItem("user"))
}
}