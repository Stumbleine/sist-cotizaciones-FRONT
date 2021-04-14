import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
  product: string;
  cant: Number;
  unit: string;
  detail:string;
}
interface Request{
  date: Date;
  sigla: string;
  total: number;
  justify: string;
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
    product: ['',[Validators.required]],
    cant: ['',[Validators.required]],
    unit: ['',[Validators.required]],
    detail: ['',[Validators.required]],
  });
  requestForm = this.formBuilder.group({
    date: ['',],
    sigla: ['',],
    total: ['',[Validators.required]],
    justify: ['',[Validators.required]],
  });
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }
  
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  pressed:boolean;

  saveProduct(value){
      console.log(JSON.stringify(value))
      this.pressed=true;
      listProducts[i]=value;
      i++;
      console.log(listProducts);
      //this.productForm.reset();
    }
    
  saveProductPressed():boolean{
    return this.pressed;
  }
  saveRequest(request){
    console.log(JSON.stringify(request))
    

  }
}
