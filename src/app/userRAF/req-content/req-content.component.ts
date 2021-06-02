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
import {ITable} from 'pdfmake-wrapper/lib/interfaces'
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

export interface ItemsQuot{
  
  quantity: number;
  unit: string;
  description:string;
  unitPrice:number;
  totalPrice:number;
}
type TableRow=[number,number,string,string]

type TableRowQuot=[number,number,string,string,number,number]

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
  public itemsQuot:ItemsQuot[]=[];

  //PENDIENTE
  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description'];
  dataSource =  new MatTableDataSource<Items>([]);
  columnas=[
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"}
  ];

  //validacion de comentario Rechazado
  justificationReject=this.formBuilder.group({
    justify:['',[]]
  })
  //variable cotizacion elegida
  quotChoice:any;
  requiredComment:boolean;
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
        this.stateButton=true;
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
    return this.stateButton;
  }
  loadDataChart(id:any){
    this.RequestService.get('http://localhost:8080/api/quotation_comparative/'+id)
    .subscribe(r  =>{
      this.chartReceived = r;
      if(this.chartReceived.length!=0){
          this.setStateButton()
        console.log("hay cuadro")
        
      }else{
        console.log("no hay cuadro!")
      }
    })
  } 
  chartData:any;
  comparativeChartRec(chartData:any){
    this.chartData=chartData;
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
    let disabled:boolean=false;

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
    this.requiredComment=required;
    return required
  }
  autorizadoPressed:boolean=false;
  rechazadoPressed:boolean=false;
  selectedButton(){
    if( this.quotChoice==undefined && this.autorizadoPressed){
      return true;
    }else{
      return false;
    }
  }


//SDC42 estados del pedido

  changeState(idSR,state:string,pdf:any){
    const formData:any = new FormData();
    formData.append("state", state);
    formData.append("comentary", this.justificationReject.value.justify);
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
    state==("Aprobado") ? formData.append("idQuotation", this.quotChoice.idPriceQuotation):formData.append("idQuotation", 0);


    

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
    
    if(state=='Rechazado' && this.justificationReject.invalid ){
      this.quotChoice=undefined
      this.rechazadoPressed=true;
      this.autorizadoPressed=false
      this.justificationReject.controls.justify.markAsTouched({onlySelf: true});
      
    }else{
      
      if(state=='Aprobado'&& this.quotChoice==undefined || this.justificationReject.invalid){
        if(this.requiredComment){
          this.rechazadoPressed=false
          this.autorizadoPressed=true;
          this.justificationReject.controls.justify.markAsTouched({onlySelf: true});
        }else{
          this.autorizadoPressed=true;
          this.rechazadoPressed=false
          this.justificationReject.controls.justify.markAsUntouched({onlySelf: true});
        }
        
      }else{
        if(state=='Rechazado' && !this.requiredComment && !this.rechazadoPressed){
          this.rechazadoPressed=true;
          this.justificationReject.controls.justify.markAsTouched({onlySelf: true});
        }else{
          const pdf = new PdfMakeWrapper();

          pdf.defaultStyle({
            fontSize:12
          })
          pdf.add(new Txt(this.reqReceived?.type).fontSize(13).bold().alignment('center').end);
          pdf.add(pdf.ln(1));
          pdf.add(new Txt('Solicitante:                             ' +  this.reqReceived?.username).end); 
          pdf.add(new Txt('Solicitado por proyecto:       ' + this.reqReceived?.initials).end);
          pdf.add(new Txt('Estado:                                    ' + state).end);
          pdf.add(new Txt('Fecha de emision:                 ' + this.reqReceived?.date).end);
          pdf.add(pdf.ln(1));
          pdf.add(new Canvas([new Line([0,0], [520, 0]).end]).end );
          //decripcion
          pdf.add(pdf.ln(1));
          pdf.add(new Txt('1.  SOLICITADO').bold().fontSize(13).end); 

          pdf.add(new Txt('Lista de articulos/servicios').margin([18,0]).end);

          
          pdf.add(this.createTable(this.items))
          pdf.add(new Txt('Total estimado:  Bs.' + this.reqReceived?.estimatedAmount).margin([18,0]).end);
          pdf.add(new Txt('Justificación:').margin([18,5]).end);
          pdf.add(new Txt(this.reqReceived?.justification).margin([18,0]).end);
          pdf.add(pdf.ln(1));
          pdf.add(new Txt('2.  COTIZACIONES').bold().fontSize(13).end); 

          

          //cotizaciones 

          for (let quot in this.quotationsCompleted){
            this.itemsQuot=this.quotationsCompleted[quot].priceQuotationDetail;
            pdf.add(pdf.ln(1));
            pdf.add(new Txt(this.quotationsCompleted[quot].nameBussiness).margin([18,0]).bold().end);
            pdf.add(new Txt('Forma de pago:               '+this.quotationsCompleted[quot].wayOfPayment).margin([35,0]).end);
            pdf.add(new Txt('Tiempo de entrega:        '+this.quotationsCompleted[quot].deliveryTerm).margin([35,0]).end);
            if(this.quotationsCompleted[quot].garantyTerm!=0){pdf.add(new Txt('Tiempo de garantia:       '+this.quotationsCompleted[quot].garantyTerm).margin([35,0]).end);}
            if(this.quotationsCompleted[quot].offValidation!=null){ pdf.add(new Txt('Validez de oferta:            '+this.quotationsCompleted[quot].offValidation).margin([35,0]).end);}
            
            pdf.add(pdf.ln(1));
            pdf.add(new Txt('Detalles de articulos/servicios').margin([18,0]).end);
            pdf.add(this.createTableQ(this.itemsQuot))
            pdf.add(new Txt('TOTAL:  Bs. '+this.quotationsCompleted[quot].total).margin([20,0]).end);
            pdf.add(new Txt('Comentarios:').margin([18,5]).end);
            pdf.add(new Txt(this.quotationsCompleted[quot].commentary).margin([18,0]).end);
            pdf.add(pdf.ln(1));
            pdf.add(new Canvas([new Line([20  ,0], [480, 0]).end]).end );
          }
          pdf.add(pdf.ln(1));
          let sc=0; let exp=0;
          for (let quot in this.quotationsCard){
            if(this.quotationsCard[quot].state == 'SIN COTIZAR'){sc++;}
            if(this.quotationsCard[quot].state == 'EXPIRADO' ){exp++;}
          }
          if(this.quotationsCard!=null){
          pdf.add(new Txt('Cotizaciones sin cotizar:     '+sc).margin([18,0]).end);
          pdf.add(new Txt('Cotizaciones expiradas:      ' +exp).margin([18,0]).end);
          }else{
            pdf.add(new Txt('No se han creado cotizaciones.').margin([100,0]).italics().end);
          }
          
          pdf.add(pdf.ln(1));

              //cuadro comparativo
          pdf.add(new Txt('3.  CUADRO COMPARATIVO').bold().fontSize(13).end);
          pdf.add(pdf.ln(1));
          if(this.reqReceived.status == 'Cotizando'){
            if(this.quotationsCard.length>1 ){
              pdf.add(this.createTableChart(this.chartData.data))
            }else{
              pdf.add(new Txt('No se ha creado cuadro comparativo.').margin([100,0]).italics().end);
            }
          }else{
            if(this.reqReceived.status == 'Pendiente'){pdf.add(new Txt('No se ha creado cuadro comparativo.').margin([100,0]).italics().end);}
          }
          pdf.add(pdf.ln(1));
          // console.log('Cuadro comparativo',this.chartData.data)


          //decision
          pdf.add(new Txt('3.  DECISIÓN').bold().fontSize(13).end);
          pdf.add(pdf.ln(1));
          if(state=='Aprobado'){ pdf.add(new Txt('Cotización elegida:           '+this.quotChoice.nameBussiness).margin([100,0]).end);
          pdf.add(new Txt('TOTAL.                               Bs. '+this.quotChoice.total).margin([100,0]).end);
          pdf.add(pdf.ln(1));
        }
          
          pdf.add(new Txt('Razón de la decisión:').margin([20,5]).end);
          pdf.add(new Txt(this.justificationReject.value.justify).margin([20,0]).end);
          //generate
          pdf.create().open()
          pdf.create().getBlob(
            b=>{
              console.log("Este es el pdf",b)
              this.changeState(this.idReqSpending,state,b);
            });
        }
      }
    } 
}

  createTable(data: Items[]):ITable{
    [{}]
    return new Table([[ 'Nro', 'CANTIDAD','UNIDAD','DETALLE'],...this.extractData(data),])
    .margin([20,10]).alignment('center').fontSize(10)
    .layout({hLineColor:(rowIndex:number,node:any,columnIndex:number)=>{
        return  '#c2c2c2';
      },vLineColor:((rowIndex:number,node:any,columnIndex:number)=>{
        return  '#c2c2c2';
      }),fillColor:((rowIndex:number,node:any,columnIndex:number)=>{
        return  rowIndex===0?'#c2c2c2':'';
      })
    }).end;
  }


  createTableQ(data: ItemsQuot[]):ITable{
    [{}]
    return new Table([[ 'Nro', 'CANTIDAD','UNIDAD','DETALLE','PRECIO UNIT','SUBTOTAL'],...this.extractDataQ(data),])
    .margin([20,10]).alignment('center').fontSize(10)
    .layout({hLineColor:(rowIndex:number,node:any,columnIndex:number)=>{
        return  '#c2c2c2';
      },vLineColor:((rowIndex:number,node:any,columnIndex:number)=>{
        return  '#c2c2c2';
      }),fillColor:((rowIndex:number,node:any,columnIndex:number)=>{
        return  rowIndex===0?'#c2c2c2':'';
      })
    }).end;
  }
  createTableChart(data:[]):ITable{
    [{}]
    var header=[]=['Nro','CANTIDAD','UNIDAD','DETALLE']
    var foot=[]
    header.concat(this.quotationsCompleted.map(x=>x.nameBussiness)).map(column=>{
      foot.push(this.getTotalCost(column))
    })

    return new Table([
      ['Nro','CANTIDAD','UNIDAD','DETALLE'].concat(this.quotationsCompleted.map(x=>x.nameBussiness)),
      ...this.extractDataChart(data),foot])
    .margin([20,10]).alignment('center').fontSize(10)
    .layout({hLineColor:(rowIndex:number,node:any,columnIndex:number)=>{
        return  '#c2c2c2';
      },vLineColor:((rowIndex:number,node:any,columnIndex:number)=>{
        return  '#c2c2c2';
      }),fillColor:((rowIndex:number,node:any,columnIndex:number)=>{
        return  rowIndex===0?'#c2c2c2':'';
      })
    }).end;
    
  }
  
  extractData(data:Items[]):TableRow[]{
    var index=1
    return data.map(row=>[index++,row.quantity,row.unit,row.description])
  }
  extractDataQ(data:ItemsQuot[]):TableRowQuot[]{
    var index=1
    return data.map(row=>[index++,row.quantity,row.unit,row.description,row.unitPrice,row.totalPrice])
    
  }
  extractDataChart(data:any[]):any[]{
    var index=1
    var listBusiness=[]
    listBusiness= listBusiness.concat(this.quotationsCompleted.map(x=>x.nameBussiness))
    
    return data.map(row=>{
            var rowNew=[index++,row.quantity,row.unit,row.description]
            listBusiness.map(business=>{
              rowNew.push(row[business])
            })
            return rowNew
    })
    
  }
  getTotalCost(nameColumn) {
    var total:any;
    if(nameColumn=='Nro'){
      total="TOTALES"
    }else{if(nameColumn=='UNIDAD'|| nameColumn=='DETALLE' || nameColumn=='CANTIDAD'){
      total=""
    }else{
      total=this.chartData.data.map(t => t[nameColumn]).reduce((acc, value) => acc + value, 0);
    }
  }
    return total
  }
  rechazar(){
    return this.rechazadoPressed;
  }
}