import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from 'src/app/services/request.service'
import { ActivatedRoute, Router } from '@angular/router';
import { DialogValidationSendComponent } from 'src/app/business/dialog-validation-send/dialog-validation-send.component';
import { SnackbarSendRequestComponent } from 'src/app/userRUG/snackbar-send-request/snackbar-send-request.component';
import { DialogValidationCancelComponent } from 'src/app/business/dialog-validation-cancel/dialog-validation-cancel.component';
import { DialogGComponent} from '../../components/dialog-g/dialog-g.component'
import { DgUploadComponent} from '../../components/dg-upload/dg-upload.component'

export interface Item{
  quantity : number,
  unit : string,
  description : string,
  unitPrice : number,
  totalPrice : number,
}
const  Items=[
  {quantity: 1, unit: 'Hydrogen', description: 1.0079},
  {quantity: 1, unit: 'Hydrogen', description: 1.0079},
  {quantity: 1, unit: 'Hydrogen', description: 1.0079},
  {quantity: 1, unit: 'Hydrogen', description: 1.0079},
];

@Component({
  selector: 'app-form-quotation',
  templateUrl: './form-quotation.component.html',
  styleUrls: ['./form-quotation.component.css']
})
export class FormQuotationComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private rutaActiva: ActivatedRoute,
  ) { }
  priceQuotationDetail: Item[] = [];
  i=0;
  itemForm = this.formBuilder.group({
    quantity: ['',[Validators.required]],
    unit: ['',[Validators.required]],
    description: ['',[Validators.required]],
    unitPrice:['',[Validators.required]],
    totalPrice:['',]
  });

  quotationForm = this.formBuilder.group({
    razonSocial:['',],
    wayOfPayment: ['',[Validators.required]],
    garantyTerm:['',],
    deliveryTerm:['',Validators.required],
    offValidation: ['',],
    total: ['',],
    commentary:['',],
    state:['COTIZADO'],
    priceQuotationDetail: [this.priceQuotationDetail,],
});


  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description','unitPrice','totalPrice'];
  dataSource =  new MatTableDataSource<Item>([]);
  columnas=[
    
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"},
    //{titulo:"PRECIO UNIT." ,name: "unitPrice"},
    //{titulo:"SUBTOTAL" ,name: "subtotalPrice"}
    
  ];
  metodo(){
    //console.log("-----",this.dataSource.data);
    this.priceQuotationDetail=this.dataSource.data
    this.priceQuotationDetail.map(i=>{
      i.totalPrice=i.quantity*i.unitPrice
    })
    this.refresh()
  }
  public items:Item[]=[];
  public idQuot:any;

  ngOnInit(): void {

    this.idQuot= this.rutaActiva.snapshot.params.idQ;
    this.loadDataQuotation();
    console.log("asasas",this.idQuot)
  }

  openGLink():void{
    this.dialog.open(DialogGComponent,{
      data:{
        idQuot:this.idQuot,

      }
    });
  }
  openUploader(){
    this.dialog.open(DgUploadComponent,{
      data:{
        idQuot:this.idQuot,

      }
    });
  }
  


  pressed:boolean;

  refresh() {
    this.dataSource.data = this.priceQuotationDetail;
} 

  saveItem(value,formDirective: FormGroupDirective){
      this.pressed=true;
      this.priceQuotationDetail[this.i]=value;
      this.priceQuotationDetail[this.i].totalPrice=this.priceQuotationDetail[this.i].quantity * this.priceQuotationDetail[this.i].unitPrice;
      this.i++;
      console.log(this.priceQuotationDetail);
      formDirective.resetForm();
      this.itemForm.reset();
      this.refresh();

    }
    public dataQuotation:any;
    public business:any;
    public id:number;
    public load=false;
    public idLastBusiness:any;

    loadDataQuotation(){
      console.log(this.idQuot);
      this.RequestService.get('http://localhost:8080/api/quotation/getById/'+this.idQuot)
      .subscribe(r=>{
        this.load=true;
        console.log(r);
        this.dataQuotation = r;
        this.business=this.dataQuotation.business
        console.log(this.business)
        this.priceQuotationDetail=this.dataQuotation.priceQuotationDetail
        this.refresh()
      })
    }

   saveQuotation(quotation,formDirective1: FormGroupDirective){
    
    quotation.priceQuotationDetail=this.priceQuotationDetail
    quotation.total= this.getTotalCost(); 
    console.log(quotation);
    if(quotation.razonSocial!=""){
      this.saveQuotationSinBusiness(quotation,formDirective1)
    }else{
        
       this.RequestService.put('http://localhost:8080/api/quotation/updateQuotation/'+this.idQuot,quotation)
       .subscribe( respuesta =>{
         console.log('Solicitud enviada!!');
         this.openSnackBar();
         console.log({"idBusiness":this.business.idBusiness})
         this.RequestService.put('http://localhost:8080/api/quotation/updateQuotationAddingBusiness/'+this.idQuot,{"idBusiness":this.business.idBusiness})
            .subscribe( respuesta =>{
              this.idLastBusiness=respuesta;
              console.log('actualizando idBusiness!!');
              window.location.reload();
              
            })
       })
       formDirective1.resetForm();
       this.quotationForm.reset();
       this.quotationForm.reset();
       this.quotationForm.get('wayOfPayment').setValue("");
       this.quotationForm.get('garantyTerm').setValue("");
       this.quotationForm.get('deliveryTerm').setValue("");
       this.quotationForm.get('offValidation').setValue("");
       this.quotationForm.get('total').setValue("");
       this.i=0;
       this.priceQuotationDetail=[];
       this.quotationForm.get('priceQuotationDetail').setValue(this.priceQuotationDetail);
       this.pressed=false;
       this.refresh();
    
    }
  }
  saveQuotationSinBusiness(quotation,formDirective1: FormGroupDirective){
    var name={};var area={}
    name['nameBusiness']=quotation.razonSocial
    area['nameArea']='Inmuebles'
    name=Object.assign(name,area)
    console.log(name)
     this.RequestService.post('http://localhost:8080/api/business/createEmpresa',name)
          .subscribe( respuesta =>{
            console.log('Empresa registrada!!');
            

            this.RequestService.get(' http://localhost:8080/api/business/getLastBusiness')
          .subscribe( respuesta =>{
            this.idLastBusiness=respuesta;
            this.idLastBusiness=this.idLastBusiness.idBusiness
            console.log('get id business!!');

            this.RequestService.put('http://localhost:8080/api/quotation/updateQuotation/'+this.idQuot,quotation)
            .subscribe( respuesta =>{
              console.log('Solicitud enviada!!');
              this.openSnackBar();
              console.log({"idBusiness":this.idLastBusiness})
              this.RequestService.put('http://localhost:8080/api/quotation/updateQuotationAddingBusiness/'+this.idQuot,{"idBusiness":this.idLastBusiness})
                 .subscribe( respuesta =>{
                   this.idLastBusiness=respuesta;
                   console.log('actualizando idBusiness!!');
                   window.location.reload();
                   
                 })
            })
            
          })
          })
          formDirective1.resetForm();
       this.quotationForm.reset();
       this.quotationForm.reset();
       this.quotationForm.get('wayOfPayment').setValue("");
       this.quotationForm.get('garantyTerm').setValue("");
       this.quotationForm.get('deliveryTerm').setValue("");
       this.quotationForm.get('offValidation').setValue("");
       this.quotationForm.get('total').setValue("");
       this.i=0;
       this.priceQuotationDetail=[];
       this.quotationForm.get('priceQuotationDetail').setValue(this.priceQuotationDetail);
       this.pressed=false;
       this.refresh(); 
}
  openDialog() {
    this.dialog.open(DialogValidationSendComponent);
  }
  openDialogCancel(){
    this.dialog.open(DialogValidationCancelComponent);
  }
  openSnackBar() {
    this._snackBar.openFromComponent(SnackbarSendRequestComponent, {
      duration: 3000,
      panelClass:"blue-snackbar",
    });
  }
  getTotalCost() {
    return this.priceQuotationDetail.map(t => t.totalPrice).reduce((acc, value) => acc + value, 0);
  }
  
  goForm(){
    this.router.navigate(['/req-content/:id']);
    window.location.reload();
  }
  thereIsBusiness():boolean{
    if(this.load==true){
      if(this.business==null){
        return true;
      }else{
        return false;
      }
    }
    
  }

}
