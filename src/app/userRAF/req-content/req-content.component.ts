import { Component, OnInit,ViewChild } from '@angular/core';
import {DgCreateCotComponent} from './../dg-create-cot/dg-create-cot.component'
import {MatDialog} from '@angular/material/dialog';
import {RequestService} from '../../services/request.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectionList, MatSelectionListChange, MatListOption } from '@angular/material/list';

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
  state:string;
  stateButton=false;
  panelOpenState =false;
  panelOpenState2=false;
  panelOpenState3=false;
  panelOpenState4=false;
  name: string;
  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description'];
  dataSource =  new MatTableDataSource<Items>([]);
  columnas=[
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"}
  ];

  dateValidation = this.formBuilder.group({
   date: ['',[Validators.required]],
    
});
  public reqReceived:any;
  public idReqSpending:any;
  public items:Items[]=[];
  public selectedBusiness:QuotForm[]=[];
  //Varibles para -quotations-card
  quotationsCards:QuotForm[]=[
    {idQuotation:1,nameCompany:'AgataWorks S.A.',status:'IMCOMPLETO',date:'25/07/2021'},
    {idQuotation:2,nameCompany:'Hemlim HEmlim McGill S.A.',status:'COMPLETADO',date:'02/07/2021'},
    {idQuotation:3,nameCompany:'Enterprise line S.A.',status:'IMCOMPLETO',date:'24/07/2021'},
    {idQuotation:4,nameCompany:'Inmobiliaria samuel S.R.L.',status:'COMPLETADO',date:'26/07/2021'},
    {idQuotation:5,nameCompany:'La empresita S.R.L', status: 'COMPLETADO', date:'21/07/2021'},
    {idQuotation:6,nameCompany:'Pollos hermano S.A.',status:'EXPIRADO',date:'21/07/2021'}
  ]
  public quotationsCard:any;
  //variables para cuadros comparativos
  public quotReceived:any;
  public chartReceived:any;
  public quotationsCompleted:any[]=[];
 
  //variables para reportes
  reports:PDFs[]=[
    {name:'Informe de rechazo',date:new Date('02/08/2021')},
    {name:'Informe de aceptación',date:new Date('02/08/2021')}
  ]
  constructor(public dialog: MatDialog,private RequestService: RequestService,private rutaActiva: ActivatedRoute,private formBuilder: FormBuilder,) {}
  @ViewChild(MatSelectionList) quots: MatSelectionList;
  ngOnInit(): void {
    this.idReqSpending= this.rutaActiva.snapshot.params.id,
    this.loadData(this.idReqSpending);
    this.loadCardQuotation(this.idReqSpending);
    
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
      console.log(r);
      this.reqReceived = r;
      this.items=this.reqReceived.requestDetail;
      this.dataSource.data=this.items;
    })
  }
  
  //Cotizaciones HTTPs and functions
  filterCompletedQ(quotationsCard){
    for (let quot in quotationsCard){

      if(quotationsCard[quot].state == 'COTIZADO' || quotationsCard[quot].state == 'INCOMPLETO'){
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
      this.loadDataChart(this.idReqSpending)  
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
  getColorQuotation(status){
    let color:string;

   if (status=='COTIZADO') {
        color = 'rgb(74 255 70 / 73%)';
      }else if(status=='INCOMPLETO'){
        color ='#FFF176';
      }
    return color;
  }

  onGroupsChange(options: MatListOption[]) {
      this.selectedBusiness=options.map(o=> o.value);
  }  
  verifyCheck():boolean{
    if(this.quotationsCompleted.length>=3 && this.stateButton==false){
      return false;
    }else{
      return true;
    } 
    
  }
  disabledButtons(status):boolean{
    let disabled:boolean;
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
  
  
  setStateButton(){
    this.stateButton=true;
  }
  setStateFalse(){
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

}
  