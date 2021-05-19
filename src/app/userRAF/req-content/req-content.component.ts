import { Component, OnInit,ViewChild } from '@angular/core';
import {DgCreateCotComponent} from './../dg-create-cot/dg-create-cot.component'
import {MatDialog} from '@angular/material/dialog';
import {RequestService} from '../../services/request.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { FormBuilder, Validators } from '@angular/forms';
import {  MatListOption } from '@angular/material/list';
import {DgChartValidationComponent} from '../dg-chart-validation/dg-chart-validation.component'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  constructor(
    public dialog: MatDialog,
    private RequestService: RequestService,
    private rutaActiva: ActivatedRoute,
    private formBuilder: FormBuilder,) {}

  state:string;
  stateButton=false;
  panelOpenState =false;
  panelOpenState2=false;
  panelOpenState3=false;
  panelOpenState4=false;
  
  public reqReceived:any;
  public idReqSpending:any;
  public items:Items[]=[];
  public selectedBusiness:QuotForm[]=[];

  //PENDIENTE
  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description'];
  dataSource =  new MatTableDataSource<Items>([]);
  columnas=[
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"}
  ];

  //Varibles para -quotations-card
  dateValidation = this.formBuilder.group({
    date: ['',[Validators.required]],
  });


  public dateExpiration:any;
  public quotationsCard:any;
  validDate(status){
    let res:boolean;
    if( status=='Aprobado' || status == 'Rechazado'){
      res=true;
    }else{
    if(this.dateExpiration!=null ){
      res=false;
    }else{
      
      res=this.dateValidation.invalid;
      //console.log("dV.INVALID..",this.dateValidation.invalid);
    }}
    return res;
  }
  //variables para cuadros comparativos
  public quotReceived:any;
  public chartReceived:any;
  public quotationsCompleted:any[]=[];
  public status:any;

 
  //variables para reportes
  reports:PDFs[]=[
    {name:'Informe de rechazo',date:new Date('02/08/2021')},
    {name:'Informe de aceptación',date:new Date('02/08/2021')}
  ]
  
  
  ngOnInit(): void {
    this.idReqSpending= this.rutaActiva.snapshot.params.id,
    this.loadData(this.idReqSpending);
    this.loadCardQuotation(this.idReqSpending);
    this.getReporte(this.idReqSpending);
    this.RequestService.disparadorChart.subscribe(data=>{
      this.stateButton=data;
    })

  }

//SOLICITUD DE PEDIDO functions and HTTP
  loadData(id:any){
    this.RequestService.get('http://localhost:8080/api/request/'+id)
    .subscribe(r  =>{
      console.log("LOAD DATA",r);
      this.reqReceived = r;
      this.items=this.reqReceived.requestDetail;
      this.dataSource.data=this.items;
    })
  }

  getColorSR(status){
    this.state=status;
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

//PENDIENTE functions
  disabledButtons(status):boolean{
    let disabled:boolean;
    this.status=status;
    if (status=='Pendiente') {
      disabled = false;
    } else if (status=='Autorizado') {
        disabled=true;
      }else if(status=='Cotizando'){
        disabled=true;
      }else if(status=='Rechazado'){
        disabled=true;
      }else if(status=='Aprobado'){
        disabled=true;
      }
    return disabled;
  }

  //COTIZACIONES
  loadCardQuotation(id:any){
    this.RequestService.get('http://localhost:8080/api/req-content/'+id+'/quotation')
    .subscribe(r  =>{
      this.quotationsCard=r;
      this.filterCompletedQ(this.quotationsCard);

      console.log("extraendo fecha",this.quotationsCard);

      this.dateExpiration=this.quotationsCard[0]?.deadline;
      console.log(typeof(this.dateExpiration))
      this.loadDataChart(this.idReqSpending)  
    })
  }
  filterCompletedQ(quotationsCard){
    for (let quot in quotationsCard){
      if(quotationsCard[quot].state == 'COTIZADO' || quotationsCard[quot].state == 'INCOMPLETO'){
        this.quotationsCompleted.push(quotationsCard[quot]);
      }
    }
  }
  openDialog(): void {
    this.dialog.open(DgCreateCotComponent,{
      data:{
        idSR:this.idReqSpending,
        items:this.items,
      }
    });
  }

  getColorQuotation(status){
    let color:string;
    if (status=='COTIZADO') {color = '#26bc2c';
        }else if(status=='INCOMPLETO'){color ='#FFC400'; }
      return color;
  }
  dateExpired:any;

  saveDateExpiration(id){
    let dateee:{}={
      "deadline":this.dateExpired
      }
    console.log(typeof(dateee),dateee);
    this.RequestService.put('http://localhost:8080/api/req-content/updateDeadLine/'+id,dateee)
    .subscribe(r=>{
      console.log("Fecha actualizada");
    })
  }

  //Cuadros comparativos functions.
  onGroupsChange(options: MatListOption[]) {
    this.selectedBusiness=options.map(o=> o.value);
  }  

  verifyCheck():boolean{
    if(this.quotationsCompleted.length>1 && this.stateButton==false){
      return false;
    }else{
      return true;
    } 
  }
  setStateButtonDialog(){
    if(this.quotationsCompleted.length>=1 && this.quotationsCompleted.length<=2){
      this.openDialogChart()
      
    }else if(this.quotationsCompleted.length>=3){
      if(this.status=='COTIZANDO'){
        this.stateButton=false;
      }else{
        this.stateButton=true;
      }
      
    }
  }
  openDialogChart() {
    this.dialog.open(DgChartValidationComponent);
  }
  setStateButton(){
    this.stateButton=true;
  }
  setStateFalse(){
    this.stateButton=false;
  }
  activateChart():boolean{
    if(this.status=='Cotizando'){
      return !this.stateButton
    }else{
      return this.stateButton;
    }
    
  }
  loadDataChart(id:any){
    this.RequestService.get('http://localhost:8080/api/quotation_comparative/'+id)
    .subscribe(r  =>{
      this.chartReceived = r;
      if(this.chartReceived.length!=0){
        console.log(this.status)
        if(this.status=='Cotizando'){
          this.setStateFalse()
        }else{
          this.setStateButton()
        console.log("hay cuadro")
        }
        
      }else{
        console.log("no hay cuadro!")
      }
    })
  } 

  //ESTADOS DE PANELES
  getPanelState(status):boolean{
    let open:boolean;
    if(status=='Pendiente'|| status=='Rechazado'){
      open=true
    }else{
      open=false
    }
    return open;
  }
  getPanelState2(status):boolean{
    let open:boolean;
    if(status=='Autorizado'|| status=='Cotizando'){
      open=true
    }else{
      open=false
    }
    return open;
  }
   
  getPanelState4(status):boolean{
    let open:boolean;
    if(status=='Rechazado'||status=='Aprobado'){
      open=true
    }else{
      open=false
    }
    return open;
  }
  getBlockedC(status){
    let block:boolean;
    if(status=='Pendiente'){
      block=true
    }else{
      if(status=='Rechazado' &&  this.quotationsCard.length === 0){
        block=true
      
      }else{
        block=false
      }

    }
    return block;
  }
  getBlocked(status){
    let block:boolean;
    if(status=='Pendiente'|| status=='Autorizado'){
      block=true
    }else{
      if(status=='Rechazado' && this.quotationsCard.length === 0){
        block=true
      }else{
        block=false
      }
    }
    return block;
  }
  
  getBlockedDecision(status){
    let block:boolean;
    if(status=='Pendiente' || status=='Autorizado'){
      block=true
    }else{
      if(this.quotationsCompleted.length==0){
        block=true
      }else{
        block=false
      }
      
    }
    return block;
  }

  //DECISION E INFORMEs
  disabledBtnAR(status):boolean{
    let disabled:boolean;
    if (status=='Cotizando' && this.quotationsCompleted.length>=1) {
      disabled = false;
    }else{
      
      disabled=true;
    
    }
    return disabled;
  }
  report:any;
  document:any;
  getReporte(id){
    this.RequestService.get('http://localhost:8080/api/report/'+id)
    .subscribe(r  =>{
      this.report=r;
      console.log("REPORTE",this.report);
      this.document=this.report.documentQuotationAtributesOutput;
    });
  }
  comentRequired(){
    let required:boolean;
   // console.log("ETTOCOMPLETED",this.quotationsCompleted.length);
    if(this.quotationsCompleted.length <=2){
      required=true;
    }else{
      required=false;
    }
    return required
  }
}
