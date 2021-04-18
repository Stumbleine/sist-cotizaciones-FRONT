import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from '../../services/request.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  
];
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

  productForm = this.formBuilder.group({
    quantity: ['',[Validators.required]],
    unit: ['',[Validators.required]],
    description: ['',[Validators.required]],
  });

  requestForm = this.formBuilder.group({
    name: ['',],
    date:[this.date,],
    status: ['pendiente',],
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
    private RequestService: RequestService
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  pressed:boolean;
  columns=[
    {titulo:"Cantidad" ,name: "quantity"},
    {titulo:"Unidad" ,name: "unit"},
    {titulo:"Detalle" ,name: "description"}
  ];

  refresh() {
    this.dataSource.data = this.requestDetail;
} 

  saveProduct(value,formDirective: FormGroupDirective){
      console.log(this.i)
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
          this.RequestService.post('http://localhost:8080/api/request',Request)
          .subscribe( respuesta =>{
            console.log('Solicitud enviada!!');
          })
          formDirective1.resetForm();
          this.requestForm.reset();
          this.productForm.reset();
          this.requestForm.get('date').setValue(this.date);
          this.requestForm.get('status').setValue("pendiente");
          this.requestForm.get('estimatedAmount').setValue("");
          this.requestForm.get('type').setValue("");
          this.requestForm.get('name').setValue("");
          this.requestForm.get('justification').setValue("");
          this.i=0;
          this.requestDetail=[];
          this.requestForm.get('requestDetail').setValue(this.requestDetail);
          this.pressed=false;
          this.refresh();
      }
      else{
          console.log("POr lo menos un detalle!!!")
      };
}
}