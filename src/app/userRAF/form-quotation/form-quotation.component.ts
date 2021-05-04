import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

export interface Items{
  idRequestDetail: number;
  quantity: number;
  unit: string;
  description:string;
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
  constructor() { }

  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description','unitPrice','subtotalPrice'];
  dataSource =  new MatTableDataSource<Items>([]);
  columnas=[
    
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"},
    {titulo:"P. UNITARIO" ,name: "unitPrice"},
    {titulo:"SUBTOTAL" ,name: "subtotalPrice"}
  ];
  public items:Items[]=[];
  

  ngOnInit(): void {
  }

}
