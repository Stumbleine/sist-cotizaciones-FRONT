import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from '../../services/request.service';
export interface Detail{
  idRequestDetail: number;
  quantity: number;
  unit: string;
  description:string;
}

@Component({
  selector: 'app-dialog-requested',
  templateUrl: './dialog-requested.component.html',
  styleUrls: ['./dialog-requested.component.css']
})
export class DialogRequestedComponent implements OnInit {
  displayedColumns: string[] = [ 'idRequestDetail','quantity', 'unit', 'description'];
  dataSource = new MatTableDataSource<Detail>([]);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private  RequestService: RequestService,
  ) { }
  
  
  ngOnInit(): void {
    this.loadDataDialog();
   
  }
  columns=[
    {titulo: "NRO", name: "idRequestDetail"},
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"}
  ];
  public requested:any;
  public details: Detail[]=[];
  public firstNum:number;
  nro=this.data.nro;

  loadDataDialog(){
    this.RequestService.get('http://localhost:8080/api/request/'+this.nro)
    .subscribe(r=>{
      console.log(r);
      this.requested = r;
      this.details=this.requested.requestDetail;
      this.dataSource.data=this.details;
       this.firstNum=this.details[0].idRequestDetail;
    })
  }
  
  variableNula(){

    if ( this.requested == null || this.requested == undefined || this.requested == "null" || this.requested == "undefined") { return false } else { return true }
  }
    
  getDescuento():Number{
      let desc= this.firstNum-1;
    return desc
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
