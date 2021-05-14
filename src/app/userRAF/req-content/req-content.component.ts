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
  date:string;
}
@Component({
  selector: 'app-req-content',
  templateUrl: './req-content.component.html',
  styleUrls: ['./req-content.component.css']
})

export class ReqContentComponent implements OnInit {
    constructor(public dialog: MatDialog,private RequestService: RequestService,private rutaActiva: ActivatedRoute) {}

  panelOpenState = false;
  panelOpenState2=false;

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
  quotationsCards:QuotForm[]=[
    {idQuotation:1,nameCompany:'AgataWorks S.A.',status:'IMCOMPLETO',date:'25/07/2021'},
    {idQuotation:2,nameCompany:'Hemlim HEmlim McGill S.A.',status:'COMPLETADO',date:'02/07/2021'},
    {idQuotation:3,nameCompany:'Enterprise line S.A.',status:'IMCOMPLETO',date:'24/07/2021'},
    {idQuotation:4,nameCompany:'Inmobiliaria samuel S.R.L.',status:'COMPLETADO',date:'26/07/2021'},
    {idQuotation:5,nameCompany:'Pollos hermano S.A.',status:'EXPIRADO',date:'21/07/2021'}
  ]
  public quotationsCard:any;
  //variables para cuadros comparativos

  quotationsCompleted=[];
  //variables para reportes
  reports:PDFs[]=[
    {name:'Informe de rechazo',date:new Date('02/08/2021')},
    {name:'Informe de aceptación',date:new Date('02/08/2021')}
  ]




  ngOnInit(): void {
    this.idReqSpending= this.rutaActiva.snapshot.params.id,
    this.loadData(this.idReqSpending);
    this.loadCardQuotation(this.idReqSpending);
    this.loadDataCharts();
  }

  openDialog(): void {
    this.dialog.open(DgCreateCotComponent,{
      data:{
        idSR:this.idReqSpending,
        items:this.items,
      }
    });
  }

  loadData(id:any){
    this.RequestService.get('http://localhost:8080/api/request/'+id)
    .subscribe(r  =>{
      console.log("request: ",r);
      this.reqReceived = r;
      this.items=this.reqReceived.requestDetail;
      this.dataSource.data=this.items;
    })
  }
  //Cotizaciones HTTPs and functions
  filterCompletedQ(quotationsCard){
    for (let quot in quotationsCard){

      if(quotationsCard[quot].state == 'COMPLETADO'){
        this.quotationsCompleted.push(quotationsCard[quot]);
      }
    }
    console.log("completos::::",this.quotationsCompleted);
  }

  loadCardQuotation(id:any){
    this.RequestService.get('http://localhost:8080/api/req-content/'+id+'/quotation')
    .subscribe(r  =>{
      this.quotationsCard=r;
      this.filterCompletedQ(this.quotationsCard);
    })
  }
  //cuadros comparativos HTTP
  loadDataCharts(){
    this.RequestService.get('http://localhost:8080/api/charts')

    // get para obtener los cuadros comparativos almacenados
  }
  createChartComparative(){
    this.RequestService.post('http://localhost:8080/api/quotation',{})
    .subscribe({
      next:()=>{
        console.log('Cotizacion creada exitosamente!!');
        this.loadDataCharts();
        //this.snack.open('Cuadro compartivo generado exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
      },
      error:()=>{
        console.log('Ocurrio un error, no se creo la cotizacon.');
        //this.snack.open('Fallo al generar el cuadro comparativo.','CERRAR',{duration:5000})
      }
    });
  }


  getColorSR(status){
    let color:string;
    if (status=='Pendiente') {
      color = '#979797';
    } else if (status=='Autorizado') {
        color = '#1975ff';
      }else if(status=='Cotizando'){
        color= '#ffc400';
      }else if(status=='Rechazado'){
        color= '#ff4848';
      }else if(status=='Aprobado'){
        color = '#28a745'
      }
    return color;
  }
}