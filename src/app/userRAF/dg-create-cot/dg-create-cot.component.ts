
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

    constructor(
      public dialogRef: MatDialogRef<DgCreateCotComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public RequestService: RequestService,private route:Router, private snack:MatSnackBar
      ) {}

  //buscador de empresas
  
  companies=[
    {nameCompany:"Empresa Moderna de Electrónica",rubro:"Electronica",eMail:"modernElectronics@gmail.com"},
    {nameCompany:"TecBolivia",rubro:"Electrónica",eMail:"tecBolivia@gmail.com"},
    {nameCompany:"servicentro electrónica",rubro:"Electrónica",eMail:"servicentro_electro@gmail.com"},
    {nameCompany:"Altaix Electrónica",rubro:"Electrónica",eMail:"altaix234@gmail.com"},
    {nameCompany:"Altaix Electrónica",rubro:"Electrónica",eMail:"altaix234@gmail.com"},
    {nameCompany:"Altaix Electrónica",rubro:"Electrónica",eMail:"altaix234@gmail.com"},
    ]
  public Companies:any;
  //variables creacion de cotizacion
  idR=this.data.idSR;
  quotationForm={
    company:{nameCompany:"Empresa Moderna de Electrónica",rubro:"Electronica",eMail:"modernElectronics@gmail.com"},
    details:this.data.items
  };

  


  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    console.log("Este es el id de la solicitud:", this.quotationForm);

  }
  getCompanies(){
    this.RequestService.get('http://localhost:8080/api/').subscribe(r=>{
      this.Companies=r;
    })

  }
  createQuataion2(){
    this.RequestService.post('http://localhost:8080/api/quotation'+this.idR, this.quotationForm)
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
  
  }


}
