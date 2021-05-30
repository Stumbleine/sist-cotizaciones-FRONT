import { Component, OnInit,ViewChild } from '@angular/core';
import {DgCreateCotComponent} from './../dg-create-cot/dg-create-cot.component'
import {MatDialog} from '@angular/material/dialog';
import {RequestService} from '../../services/request.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { FormBuilder, Validators } from '@angular/forms';
import {  MatListOption } from '@angular/material/list';
import {DgChartValidationComponent} from '../dg-chart-validation/dg-chart-validation.component'
import {PdfMakeWrapper, Txt, Table, Columns,DocumentDefinition, Canvas, Line} from 'pdfmake-wrapper'

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
  public quotationsCard=null;
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
  public pressedNew=false;

 
  //variables para reportes
  reports:PDFs[]=[
    {name:'Informe de rechazo',date:new Date('02/08/2021')},
    {name:'Informe de aceptación',date:new Date('02/08/2021')}
  ]
  
  
  ngOnInit(): void {
    this.idReqSpending= this.rutaActiva.snapshot.params.id,
    this.loadData(this.idReqSpending);

    this.loadCardQuotation(this.idReqSpending);
    //this.reqReceived.status == ('Aprobado' || 'Rechazado')? this.getReporte(this.idReqSpending):
    this.getReporte(this.idReqSpending)
    this.RequestService.disparadorChart.subscribe(data=>{
      this.stateButton=data;
    })

  }

//SOLICITUD DE PEDIDO functions and HTTP
  loadData(id:any){
    this.RequestService.get('http://localhost:8080/api/request/'+id)
    .subscribe(r  =>{
      console.log("LOAD DATA PEDIDO",r);
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
  DecisionDescripcion:boolean=false;
  rechazarPendiente(){
    this.DecisionDescripcion=!this.DecisionDescripcion;
  }

  //COTIZACIONES
  loadCardQuotation(id:any){
    this.RequestService.get('http://localhost:8080/api/req-content/'+id+'/quotation')
    .subscribe(r =>{
        this.quotationsCard=r;
        console.log("TARJETAS QuotS .... ",this.quotationsCard);
        this.filterCompletedQ(this.quotationsCard);
        this.dateExpiration=this.quotationsCard[0]?.deadline;

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
        cards:this.quotationsCard,
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
    this.RequestService.put('http://localhost:8080/api/req-content/updateDeadLine/'+id,dateee)
    .subscribe(r=>{
      console.log("Fecha actualizada !!!!");
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
      /* if(this.status=='Cotizando'){
        this.stateButton=false;
      }else{ */
        this.stateButton=true;
      //}
      
    }
  }
  openDialogChart() {
    this.dialog.open(DgChartValidationComponent);
  }
  setStateButton(){
    this.stateButton=true;
  }
  setStateFalse(){
    this.pressedNew=true;
    this.stateButton=false;
  }
  activateChart():boolean{
    /* console.log(this.stateButton)
    if(this.status=='Cotizando'){
      return !this.stateButton
    }else{
      return this.stateButton;
    }  */
    return this.stateButton;
  }
  loadDataChart(id:any){
    this.RequestService.get('http://localhost:8080/api/quotation_comparative/'+id)
    .subscribe(r  =>{
      this.chartReceived = r;
      if(this.chartReceived.length!=0){
        console.log("?????????",this.status)
        /* if(this.status=='Cotizando'){
          this.setStateButton()
          this.setStateFalse()
        }else{ */ 
          this.setStateButton()
        console.log("hay cuadro")
       // }
        
      }else{
        console.log("no hay cuadro!")
      }
    })
  } 

  //ESTADOS DE PANELES
  //expanded
  getPanelState(status):boolean{
    let open:boolean;
    if(status=='Pendiente'){
      open=true
    }else{
      open=false
    }
    return open;
  }
  //expanded
  getPanelState2(status):boolean{
    let open:boolean;
    if(status=='Autorizado'|| status=='Cotizando'){
      open=true
    }else{
      open=false
    }
    return open;
  }
   //expanded Decision
  getPanelState4(status):boolean{
    let open:boolean;
    if(status=='Rechazado'||status=='Aprobado'){
      open=true
    }else{
      open=false
    }
    return open;
  }
  //Blocked COTIZACIONES
  getBlockedC(status){
 //   console.log("TARJETAS EN EL panel COTIZACIONES",this.quotationsCard);
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
  getBlockedCuadros(status){
    //console.log("TARJETAS EN EL panel CUADROS",this.quotationsCard);
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
    if(status=='Rechazado'){
      return false
    }
    if(status=='Pendiente' || status=='Autorizado' || this.quotationsCompleted.length==0){
      block=true
    }
    

    return block;
  }

  //DECISION E INFORMEs
  disabledBtnAR(status):boolean{
    let disabled:boolean;

    if(status=='Cotizando' && this.quotationsCompleted.length>=2){
      if(this.chartReceived.length==0){
        disabled=true;
      }
    }else{
      if (status=='Cotizando' && this.quotationsCompleted.length>=1) {
        disabled = false;
      }else{  
        disabled=true;
      }
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

    if(this.quotationsCompleted.length <=2){
      required=true;
    }else{
      required=false;
    }
    return required
  }



//SDC42 estados del pedido

  changeState(idSR,state:string,pdf:any){
    const formData:any = new FormData();
    formData.append("state", state);
    formData.append("comentary", "Comentario predeterminado..");
    let pdf2 = new Blob([],{type: 'application/pdf'});
    
    if(state=='Autorizado'){
      formData.append("document", pdf2)
    }else{
      if(state=='Rechazado'){
        formData.append("document", pdf,"Informe de rechazo");
      }
      if(state=='Aprobado'){
        formData.append("document", pdf,"Informe de aprobacion");
      }
    }
    //console.log(this.quotationsCompleted[0].idPriceQuotation)
    state==("Aprobado") ? formData.append("idQuotation", this.quotationsCompleted[0].idPriceQuotation):formData.append("idQuotation", 0);


    

    this.RequestService.put('http://localhost:8080/api/request/'+idSR,formData)
    .subscribe({
        next(){
          for (var pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]); 
          }
          console.log("Estado actualizado.", state)
          window.location.reload();
        },
        error(){
          for (var pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]); 
          }
          console.log("Error al actualizar estado.",state)
        }
      });
  }
  generateReport(state:string){
    const pdf = new PdfMakeWrapper();


    pdf.defaultStyle({
      fontSize:12
    })
    pdf.add(new Txt(this.reqReceived?.type).bold().alignment('center').end);
    pdf.add(new Txt('Solicitante:                             ' +  this.reqReceived?.username).end); 
    pdf.add(new Txt('Solicitado por proyecto:       ' + this.reqReceived?.initials).end);
    pdf.add(new Txt('Estado:                                    ' + this.reqReceived?.status).end);
    pdf.add(new Txt('Fecha de emision:                 ' + this.reqReceived?.date).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Canvas([new Line([0,0], [500, 0]).end]).end );
    //decripcion

    //cotizaciones   
      
    //cuadro

    //decision


    //generate
    pdf.create().open()
    pdf.create().getBlob(
      b=>{
        console.log("Este es el pdf",b)
        this.changeState(this.idReqSpending,state,b);
      }
    );
  }

}