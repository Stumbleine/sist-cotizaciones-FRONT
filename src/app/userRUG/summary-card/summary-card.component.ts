import { Component, OnInit,Input } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogRequestedComponent} from '../dialog-requested/dialog-requested.component'
import { RequestService } from 'src/app/services/request.service';
@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css']
})
export class SummaryCardComponent implements OnInit {

  constructor( 
    public dialog: MatDialog,
    public RequestService: RequestService,
    ) { }

  ngOnInit(): void {
    this.getPDFReport()
  }
  @Input() type: string;
  @Input() nro:string;
  @Input() sigla: string;
  @Input() username: string;
  @Input() amount:string;
  @Input() status:string;
  @Input() date:string;
  @Input() permitFile:boolean;

  openDialog() {
    this.dialog.open(DialogRequestedComponent,{
    width: '70%',
    data: { nro:this.nro }
    });
  }
  data:any;
  getPDFReport(){
    if(this.status== "Rechazado"|| this.status=="Aprobado"){
      this.RequestService.get('http://localhost:8080/api/Document/Report/'+this.nro)
    .subscribe(file=>{
    this.data=file;
    console.log(this.data)
    })
    }
    
  }
  openReport(){
    this.getPDF_blob();
  }

  getPDF_blob(){
    this.RequestService.getFile('http://localhost:8080/api/Document/blob/Report/'+this.nro).subscribe(blob=>{
    let pdf = new Blob([blob],{type: 'application/pdf'});
    let fileData = new File([pdf], "name", {type: 'application/pdf'});
    let fileURL = window.URL.createObjectURL(fileData);
    window.open(fileURL,"_blank")
    console.log("THIS IS BLOB",blob)
    //saveAs(blob, data?.nameDocumenQuotaion);
    })
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