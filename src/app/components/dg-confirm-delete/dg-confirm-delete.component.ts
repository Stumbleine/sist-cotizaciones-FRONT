import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RequestService} from '../../services/request.service';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-dg-confirm-delete',
  templateUrl: './dg-confirm-delete.component.html',
  styleUrls: ['./dg-confirm-delete.component.css']
})
export class DgConfirmDeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public RequestService: RequestService,
  private snack:MatSnackBar,) { }

  idQuot=this.data.idQuot;
  nameBussines=this.data.nameCompany;
  ngOnInit(): void {

  }
  dataFile:any;
  getFiles(){
    this.RequestService.get('http://localhost:8080/api/Document/Quotation/'+this.idQuot)
    .subscribe(file=>{
        this.dataFile=file;
        console.log('FILE :', this.dataFile);
    })
  }
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
        window.location.reload();
    }
  }
  deleteDoc(){
    this.RequestService.delete2('Document/delete/'+this.idQuot).subscribe({
      next:()=>{
        console.log('Archivo eliminado')
      },
      error:()=>{
        console.log('Archivo no eliminado')
      },
    })

  }
}
