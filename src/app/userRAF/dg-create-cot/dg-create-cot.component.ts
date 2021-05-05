
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RequestService} from '../../services/request.service';
import {Router} from '@angular/router'
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-dg-create-cot',
  templateUrl: './dg-create-cot.component.html',
  styleUrls: ['./dg-create-cot.component.css']
})
export class DgCreateCotComponent implements OnInit {
  favoriteSeason: string;
  seasons: string[] = ['Cotizacion manual', 'Cotizacion digital'];
  quotationForm={idSpendingRequest:this.data.idSR};
  idR=this.data.idSR;
  send:boolean;

  constructor(
    public dialogRef: MatDialogRef<DgCreateCotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public RequestService: RequestService,private route:Router, private snack:MatSnackBar
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    console.log("Este es el id de la solicitud:", this.quotationForm);

  }

  createQuataion2(){
    this.RequestService.post('http://localhost:8080/api/quotation',{})
    .subscribe({
      next:()=>{
        console.log('Cotizacion creada exitosamente!!');
        this.route.navigate(['/req-content', this.idR,'form-quotation']);
        this.snack.open('Cotizacion creada exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
      },
      error:()=>{
        console.log('Ocurrio un error, no se creo la cotizacon.');
        this.snack.open('Fallo al crear cotizacion.','CERRAR',{duration:5000})
      }
    });
  
  }/*
  createQuataion(){
    this.RequestService.post('http://localhost:8080/api/quotation',{})
    .subscribe({
      next:function(){
        console.log('Cotizacion creada exitosamente!!');
        this.send=true;
        this.global()
        console.log(this.send);
      },
      error:function(){
        console.log('Ocurrio un error, no se creo la cotizacon.');
        this.send=false;
        console.log(this.send);
        
      },

    })
  }*/
}
