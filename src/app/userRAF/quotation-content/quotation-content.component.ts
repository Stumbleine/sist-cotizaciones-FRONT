import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RequestService} from '../../services/request.service';
import { MatTableDataSource } from '@angular/material/table';

export interface Items{
  idRequestDetail: number;
  quantity: number;
  unit: string;
  description:string;
  unitPrice:string;
  totalPrice:string;
}
@Component({
  selector: 'app-quotation-content',
  templateUrl: './quotation-content.component.html',
  styleUrls: ['./quotation-content.component.css']
})


export class QuotationContentComponent implements OnInit {

  constructor(
    private rutaActiva: ActivatedRoute, 
    private RequestService: RequestService,
    ) { }

  idQuot:any;
  quotation:any;
  business:any;

  public items:Items[]=[];
  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description','unitPrice','totalPrice'];
  dataSource =  new MatTableDataSource<Items>([]);
  columnas=[
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"},
    {titulo:"PRECIO UNITARIO" ,name: "unitPrice"},
    {titulo:"SUBTOTAL" ,name: "totalPrice"}
  ];

  
  ngOnInit(): void {
    this.idQuot= this.rutaActiva.snapshot.params.quotID;
    this.getQuot(); 
  }
  getQuot(){
    this.RequestService.get('http://localhost:8080/api/quotation/getById/'+this.idQuot)
    .subscribe(r=>{
      this.quotation=r;
      console.log("Cotizacion : ",this.quotation);

      this.items=this.quotation.priceQuotationDetail;
      this.business=this.quotation.business;
      this.dataSource.data=this.items;
      console.log(this.business);
    });
  }
  getColorSR(status){
    let color:string;
    if (status=='COTIZADO') {
      color = '#28a745';
      } else if (status=='INCOMPLETO') {
        color = '#ffc400';
        }
    return color;
  }
}
