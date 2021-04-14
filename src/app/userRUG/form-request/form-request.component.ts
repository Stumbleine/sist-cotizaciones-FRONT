import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
interface Product{
  name: string;
  quantity: Number;
  unit: string;
  description:string;
}
interface Request{
  status: Date;
  name: string;
  estimated_amount: number;
  detail: string;
}
const listProducts: Product[] = [];
var i=0;
@Component({
  selector: 'app-form-request',
  templateUrl: './form-request.component.html',
  styleUrls: ['./form-request.component.css']
})
export class FormRequestComponent implements OnInit {
  productForm = this.formBuilder.group({
    name: ['',[Validators.required]],
    quantity: ['',[Validators.required]],
    unit: ['',[Validators.required]],
    description: ['',[Validators.required]],
  });
  requestForm = this.formBuilder.group({
    status: ['pendiente',],
    name: ['',],
    estimated_amount: ['',[Validators.required]],
    detail: ['',[Validators.required]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService
  ) { }

  ngOnInit(): void {
  }
  
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  pressed:boolean;

  saveProduct(value){
      //console.log(JSON.stringify(value))
      this.pressed=true;
      listProducts[i]=value;
      i++;
      console.log(listProducts);
      this.productForm.reset();
      this.productForm.get('name').clearValidators();
      this.productForm.get('name').updateValueAndValidity();
      this.productForm.get('quantity').clearValidators();
      this.productForm.get('quantity').updateValueAndValidity();
      this.productForm.get('unit').clearValidators();
      this.productForm.get('unit').updateValueAndValidity();
      this.productForm.get('description').clearValidators();
      this.productForm.get('description').updateValueAndValidity();
    }
    
  saveProductPressed():boolean{
    return this.pressed;
  }
  saveRequest(request){
    Request=request;
    console.log(Request);
    this.RequestService.post('http://localhost:8080/api/request',Request)
    .subscribe( respuesta =>{
      console.log('Solicitud enviada!!');
    })
    this.requestForm.reset();
    this.productForm.reset();
        this.requestForm.get('status').clearValidators();
        this.requestForm.get('status').updateValueAndValidity();
        this.requestForm.get('name').clearValidators();
        this.requestForm.get('name').updateValueAndValidity();
        this.requestForm.get('estimated_amount').clearValidators();
        this.requestForm.get('estimated_amount').updateValueAndValidity();
        this.requestForm.get('detail').clearValidators();
        this.requestForm.get('detail').updateValueAndValidity();
        this.productForm.get('name').clearValidators();
        this.productForm.get('name').updateValueAndValidity();
        this.productForm.get('quantity').clearValidators();
        this.productForm.get('quantity').updateValueAndValidity();
        this.productForm.get('unit').clearValidators();
        this.productForm.get('unit').updateValueAndValidity();
        this.productForm.get('description').clearValidators();
        this.productForm.get('description').updateValueAndValidity();
    
  }
}
