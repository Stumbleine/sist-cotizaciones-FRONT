
import { Component, OnInit, Inject, Output } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RequestService} from '../../services/request.service';
import {Router} from '@angular/router'
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatListOption } from '@angular/material/list';
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
  

  public Companies:any;
  //variables creacion de cotizacion
  public nameArea:string="Inmuebles"
  public listBusinessSelected:any[]=[]
  public quotationForm:any;
  idR=this.data.idSR;
  cardsQuotations=this.data.cards;

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    console.log("Este es el id de la solicitud:", this.quotationForm);
    this.getCompanies();
  }
  getCompanies(){
    this.RequestService.get('http://localhost:8080/api/area/getBusinessesByAreaName/'+this.nameArea).subscribe(r=>{
      this.Companies=r;
    })
  }
  
  getListBusiness(options: MatListOption[]) {
    this.listBusinessSelected=options.map(o=> o.value);
    console.log(this.listBusinessSelected)
}
getQuotationForm(){
  var list=[];var details={};
  if(this.listBusinessSelected.length==0){
    this.data.items.map(d=>{
      var detail={};var description={};var unit={};var quantity={}
      quantity['quantity']=d.quantity
      unit['unit']=d.unit
      description['description']=d.description
      detail=Object.assign(quantity,unit,description,{"unitPrice":null,"totalPrice":null})
      list.push(detail)
    })
      details['priceQuotationDetail']=list
       this.quotationForm =Object.assign({"idBusiness":null,"wayOfPayment" : "","garantyTerm" :null ,"deliveryTerm" :null ,"offValidation" : "","total" : null,"state":"SIN COTIZAR","commentary":"","idSpendingUnitRequest":this.idR},details)
       console.log(this.quotationForm)

       this.RequestService.post('http://localhost:8080/api/quotation/createQuotation/'+this.idR, this.quotationForm)
       .subscribe({
         next:()=>{
           console.log('Cotizacion creada exitosamente!!');
           this.RequestService.put('http://localhost:8080/api/quotation/RelatingPriceQuotationToDetails',{})
            .subscribe( respuesta =>{
             console.log('put enviada!!');
             //window.location.reload();
        })
           //this.route.navigate(['/req-content', this.idR,'form-quotation']);
           this.snack.open('Cotizacion creada exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
           
           if(this.cardsQuotations.length===0){
            this.changeState(this.idR);
           }
           
         },
         error:()=>{
           console.log('Ocurrio un error, no se creo la cotizacon.');
           this.snack.open('Fallo al crear cotizacion.','CERRAR',{duration:5000})
         }
       });
       
  }else{
    this.listBusinessSelected.map(i=>{
      var id={};var list=[];var details={};
      id['idBusiness']=i.idBusiness
      this.data.items.map(d=>{
        var detail={};var description={};var unit={};var quantity={}
        quantity['quantity']=d.quantity
        unit['unit']=d.unit
        description['description']=d.description
        detail=Object.assign(quantity,unit,description,{"unitPrice":null,"totalPrice":null})
        list.push(detail)
      })
        details['priceQuotationDetail']=list
         this.quotationForm =Object.assign(id,{"wayOfPayment" : "","garantyTerm" :null ,"deliveryTerm" :null ,"offValidation" : "","total" : null,"state":"SIN COTIZAR","commentary":"","idSpendingUnitRequest":this.idR},details)
         console.log(this.quotationForm)
  
         this.RequestService.post('http://localhost:8080/api/quotation/createQuotation/'+this.idR, this.quotationForm)
         .subscribe({
           next:()=>{
             console.log('Cotizacion creada exitosamente!!');
             this.RequestService.put('http://localhost:8080/api/quotation/RelatingPriceQuotationToDetails',{})
             .subscribe( respuesta =>{
              console.log('put enviada!!');
              window.location.reload();
            })

            if(this.cardsQuotations.length===0){
              this.changeState(this.idR);
             }

             this.snack.open('Cotizacion creada exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
             
            },
           error:()=>{
             console.log('Ocurrio un error, no se creo la cotizacon.');
             this.snack.open('Fallo al crear cotizacion.','CERRAR',{duration:5000})
           }
         });
         
    })
  }
  
}
  createQuataion2(){
    this.RequestService.post('http://localhost:8080/api/quotation/createQuotation/'+this.idR, this.quotationForm)
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
changeState(idSR){
    const formData:any = new FormData();
    formData.append("state", 'Cotizando');
    formData.append("comentary", "Comentario predeterminado..");
    formData.append("document", null);

    this.RequestService.put('http://localhost:8080/api/request/'+idSR,formData)
    .subscribe({
        next(){
          console.log("Estado actualizado.")
          window.location.reload();
        },
        error(){
          console.log("Error al actualizar estado.")
        }
      });
  }

}
