import { Component, OnInit } from '@angular/core';
import {DgCreateCotComponent} from './../dg-create-cot/dg-create-cot.component'
import {MatDialog} from '@angular/material/dialog';
import {RequestService} from '../../services/request.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';


export interface DialogData {
  animal: string;
  name: string;
}
export interface Items{
  idRequestDetail: number;
  quantity: number;
  unit: string;
  description:string;
}
export interface PDFs{
  name:String;
  date:Date;
}

export interface QuotForm{
  idQuotation:number;
  nameCompany:string;
  status:string;
  date:Date;
}
@Component({
  selector: 'app-req-content',
  templateUrl: './req-content.component.html',
  styleUrls: ['./req-content.component.css']
})

export class ReqContentComponent implements OnInit {
  panelOpenState = false;
  panelOpenState2=false;
  name: string;
  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description'];
  dataSource =  new MatTableDataSource<Items>([]);
  columnas=[
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"}
  ];

  public reqReceived:any;
  public idReqSpending:any;
  public items:Items[]=[];
  //Varibles para -quotations-card
  quotationsCard:QuotForm[]=[
    {idQuotation:1,nameCompany:'AgataWorks S.A.',status:'IMCOMPLETO',date:new Date('25/07/2021')},
    {idQuotation:2,nameCompany:'Hemlim HEmlim McGill S.A.',status:'COMPLETO',date:new Date('29/07/2021')},
    {idQuotation:3,nameCompany:'Enterprise line S.A.',status:'IMCOMPLETO',date:new Date('24/07/2021')},
    {idQuotation:4,nameCompany:'Inmobiliaria samuel S.R.L.',status:'COMPLETO',date:new Date('26/07/2021')},
    {idQuotation:5,nameCompany:'Pollos hermano S.A.',status:'CADUCADO',date:new Date('21/07/2021')}
  ]

  quotationsCompleted:String[]=['NombreEmpresa #4','NombreEmpresa #3','NombreEmpresa #2', 'NombreEmpresa #5'];
  //variables para reportes
  reports:PDFs[]=[
    {name:'Informe de rechazo',date:new Date('02/08/2021')},
    {name:'Informe de aceptación',date:new Date('02/08/2021')}
  ]
  constructor(public dialog: MatDialog,private RequestService: RequestService,private rutaActiva: ActivatedRoute) {}

  ngOnInit(): void {
    this.idReqSpending= this.rutaActiva.snapshot.params.id,
    this.loadData(this.idReqSpending);
  }

  openDialog(): void {
    this.dialog.open(DgCreateCotComponent,{
      data:{idSR:this.idReqSpending}
    });
  }

  loadData(id:any){
    this.RequestService.get('http://localhost:8080/api/request/'+id)
    .subscribe(r  =>{
      console.log(r);
      this.reqReceived = r;
      this.items=this.reqReceived.requestDetail;
      this.dataSource.data=this.items;
    })
  }
}
