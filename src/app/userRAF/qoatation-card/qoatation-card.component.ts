import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import {RequestService} from '../../services/request.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import { DgConfirmDeleteComponent } from 'src/app/components/dg-confirm-delete/dg-confirm-delete.component';
@Component({
  selector: 'app-qoatation-card',
  templateUrl: './qoatation-card.component.html',
  styleUrls: ['./qoatation-card.component.css']
})
export class QoatationCardComponent implements OnInit {

  constructor(
    private route:Router,  
    public RequestService: RequestService,
    private snack:MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getFiles();
  }
  @Input() idSR:any
  @Input() quot:any;
  @Input() reqStatus:any;
  @Input() manageQuotes:boolean;

  
  routerQuotation(status){
    if(status == 'SIN COTIZAR'){
      this.route.navigate(['/req-content', this.idSR ,'form-quotation',this.quot.idPriceQuotation]);

    }else if( status == 'COTIZADO' ){
      this.route.navigate(['/req-content',this.idSR,'quot-content', this.quot.idPriceQuotation]);
    }else if(status == 'INCOMPLETO'){
      this.route.navigate(['/req-content',this.idSR,'quot-content', this.quot.idPriceQuotation]);
    }else if(status == 'EXPIRADO'){
      this.route.navigate(['/req-content',this.idSR,'error']);
    }
   // [routerLink]="['/quot-content', quot?.idPriceQuotation]"

  }

  getColor(status){
    let color:string;
    if (status=='SIN COTIZAR') {
      color = '#f7f7f7'
    } else if (status=='COTIZADO') {
        color = 'rgb(74 255 70 / 73%)';
      }else if(status=='EXPIRADO'){
        color= 'rgb(255 143 133 / 90%)';
      }else if(status=='INCOMPLETO'){
        color ='#FFF176';
      }
    return color;
  }

  dataFile:any;
  getFiles(){
    this.RequestService.get('http://localhost:8080/api/Document/Quotation/'+this.quot.idPriceQuotation)
    .subscribe(file=>{
        this.dataFile=file;
        console.log('FILE :', this.dataFile);
    })
  }
  actionDelete(idQuot){
    const dialogRef=this.dialog.open(DgConfirmDeleteComponent,
      {
        data:{
          idQuot:idQuot,
          nameCompany:this.quot.nameBussiness,
          quotState:this.quot.state,
        }
      })
  }/*
  deleteQuot(idQuot){

    if(this.dataFile!=null){
      this.deleteDoc();
      this.RequestService.delete2('quotation/deleteQuotation/'+idQuot).subscribe({
          next:()=>{
            console.log('cotizacion eliminado')
            this.snack.open('Cotizacion eliminada','CERRAR',{duration:5000,panelClass:'snackSuccess'})
          },
          error:()=>{
            console.log('Ocurrio un error al eliminar cotizacion')
            this.snack.open('Ocurrio un error al eliminar cotizacion','CERRAR',{duration:5000})
          },
        })

    }else{
      this.RequestService.delete2('quotation/deleteQuotation/'+idQuot).subscribe({
          next:()=>{
            console.log('cotizacion eliminado')
            this.snack.open('Cotizacion eliminada','CERRAR',{duration:5000,panelClass:'snackSuccess'})
          },
          error:()=>{
            console.log('Ocurrio un error al eliminar cotizacion')
            this.snack.open('Ocurrio un error al eliminar cotizacion','CERRAR',{duration:5000})
          },
        })
    }
  }
  deleteDoc(){
    this.RequestService.delete2('Document/delete/'+this.quot.idPriceQuotation).subscribe({
      next:()=>{
        console.log('Archivo eliminado')
      },
      error:()=>{
        console.log('Archivo no eliminado')
      },
    })

  }*/
}
