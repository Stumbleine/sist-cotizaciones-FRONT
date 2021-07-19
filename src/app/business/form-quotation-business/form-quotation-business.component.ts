import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogValidationComponent } from 'src/app/userRUG/dialog-validation/dialog-validation.component';
import { SnackbarSendRequestComponent } from 'src/app/userRUG/snackbar-send-request/snackbar-send-request.component';
import {RequestService} from '../../services/request.service';
import { DialogValidationCancelComponent } from '../dialog-validation-cancel/dialog-validation-cancel.component';
import { DialogValidationSendComponent } from '../dialog-validation-send/dialog-validation-send.component';
import { DgUploadComponent} from '../../components/dg-upload/dg-upload.component'

import {DgCompanyRegisterComponent } from '../dg-company-register/dg-company-register.component'
import { ActivatedRoute } from '@angular/router';
export interface Item{
  quantity : number,
  unit : string,
  description : string,
  features:string,
  unitPrice : number,
  totalPrice : number,
}

export interface Quotation{
  wayOfPayment: string,
    garantyTerm:String,
    deliveryTerm:string,
    offValidation: number,
    total: string,
    priceQuotationDetail: Item[],
    businessCompanyName:string,
}
export interface ItemFile {
  idRow:string,
  fileFeature:File
}
@Component({
  selector: 'app-form-quotation-business',
  templateUrl: './form-quotation-business.component.html',
  styleUrls: ['./form-quotation-business.component.css']
})
export class FormQuotationBusinessComponent implements OnInit {
  priceQuotationDetail: Item[] = [];
  Quotation:Quotation;
  i=0;

  itemForm = this.formBuilder.group({
    quantity: ['',[Validators.required]],
    unit: ['',[Validators.required]],
    description: ['',[Validators.required]],
    unitPrice:['',[Validators.required]],
    totalPrice:['',]
  });

  quotationForm = this.formBuilder.group({
      businessCompanyName:['',],
      wayOfPayment: ['',[Validators.required]],
      garantyTerm:['',],
      deliveryTerm:['',Validators.required],
      offValidation: ['',],
      total: ['',],
      commentary:['',],
      state:['COTIZADO'],
      priceQuotationDetail: [this.priceQuotationDetail,],
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private rutaActiva: ActivatedRoute, 
  ) { }
  
  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description','features','upload','unitPrice','totalPrice'];
  dataSource =  new MatTableDataSource<Item>([]);
  columnas=[
    
    {titulo:"CANTIDAD" ,name: "quantity"},
    {titulo:"UNIDAD" ,name: "unit"},
    {titulo:"DETALLE" ,name: "description"},
    //{titulo:"PRECIO UNIT." ,name: "unitPrice"},
    
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
  public idQuotEncode:any;
  public idQuot:any;
  public lastQuotation:any;
  ngOnInit(): void {
    this.RequestService.disparadorDataQuotation.subscribe(data=>{this.lastQuotation=data})
    /* if(this.lastQuotation != null){
      this.loadDataQuotation();
      this.updateDataQuotation();
    } */
    this.idQuotEncode= this.rutaActiva.snapshot.params.idQ;
    this.idQuot=window.atob(this.idQuotEncode);
    this.loadDataQuotation();
    
    console.log("this is quotID",this.idQuot);
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
      this.RequestService.get('http://localhost:8080/api/quotation/getById/'+this.idQuot)
      .subscribe(r=>{
        this.load=true;
        console.log(r);
        this.dataQuotation = r;
        let state=this.dataQuotation.state
        if(state == 'SIN COTIZAR'){
          this.business=this.dataQuotation.business
          console.log("EMPRESA ->",this.business)
          this.priceQuotationDetail=this.dataQuotation.priceQuotationDetail
          console.log(typeof(this.priceQuotationDetail))



          this.refresh()
          }else if( state == 'COTIZADO' ){
            this.router.navigate(['/response-form']);
              }else if(state == 'INCOMPLETO'){
                this.router.navigate(['/response-form']);
                }else if(state == 'EXPIRADO'){
                  this.router.navigate(['/error']);
        }
        //this.business=this.dataQuotation.business
      })
    }
  saveQuotation(quotation,formDirective1: FormGroupDirective){
    this.Quotation=quotation;
    
    quotation.priceQuotationDetail=this.priceQuotationDetail
    quotation.total= this.getTotalCost(); 
    console.log(quotation);
    if(quotation.businessCompanyName!=""){
      this.saveQuotationSinBusiness(quotation,formDirective1)
    }else{
        //if(this.pressed){  
       // quotation.total= this.getTotalCost();  
       // this.RequestService.post('http://localhost:8080/api/quotation',quotation)
       
       quotation.priceQuotationDetail.map(detail=>{
         if(detail.unitPrice == null){
            quotation.state='INCOMPLETO'
         }
        
       })
       console.log(quotation)
       this.RequestService.put('http://localhost:8080/api/quotation/updateQuotation/'+this.idQuot,quotation)
       .subscribe( respuesta =>{
         console.log('Solicitud enviada!!');
         //this.openSnackBar();
         console.log({"idBusiness":this.business.idBusiness})
         this.RequestService.put('http://localhost:8080/api/quotation/updateQuotationAddingBusiness/'+this.idQuot,{"idBusiness":this.business.idBusiness})
            .subscribe( respuesta =>{
              this.idLastBusiness=respuesta;
              this.postFilesFeatures();
              console.log('actualizando idBusiness!!');
              
              
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

       //window.location.reload();
   /* }
   else{
       console.log("Por lo menos un item!!!")
       this.openDialog()
   }; */
    }
      
}
  saveQuotationSinBusiness(quotation,formDirective1: FormGroupDirective){
    
    quotation.priceQuotationDetail.map(detail=>{
      if(detail.unitPrice == null){
        quotation.state='INCOMPLETO'
      }
    })
    //console.log(quotation)
    this.RequestService.put('http://localhost:8080/api/quotation/updateQuotation/'+this.idQuot,quotation)
              .subscribe( respuesta =>{
                console.log('Solicitud enviada!!');
                this.postFilesFeatures(); 
                //this.openSnackBar();
                
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

       // window.location.reload();
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
    this.router.navigate(['/cotizador/form-quotation/:id']);
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
  //registrarEmpresa
  saveRsocial(e:any){
    const jsonData = JSON.stringify(e.target.value)
    localStorage.setItem('Razon social', jsonData);
  }
  openRegister(){
    this.quotationForm.get('priceQuotationDetail').setValue(this.priceQuotationDetail);
    this.dialog.open(DgCompanyRegisterComponent,{  
      data:{
      //razonsocial:localStorage.getItem('Razon social'),
        razonsocial:this.quotationForm.get('businessCompanyName').value,
      idQuotation:this.idQuot,
      quotation: this.quotationForm.value
      }
    });
  }
//archivos por item
  fileItem:File;
  listFiles:ItemFile[]=[];
  listID:any=[];
  openUploader(idRow){

    const dialogRef=this.dialog.open(DgUploadComponent,{
      data:{
        idRowItem:idRow,
        transform:'featureFile'
      }
    });
    dialogRef.afterClosed().subscribe(response=>{
      this.fileItem=response;
      let itemFile:ItemFile={
        idRow:idRow,
        fileFeature:this.fileItem
      }
      this.listFiles.push(itemFile);
      if(response){
        this.listID.push(idRow);
      }
    })
  }
  findIdfile(idRowItem){
    let colorFile:string;
    if(this.listID.find(id=>id==idRowItem)){
      colorFile='#0a6cff'
    }else{colorFile='#7c7c7c;'}
    return colorFile;
  }

  postFilesFeatures(){
    console.log("ARCHIVOS por item : =>>>>>",this.listFiles)
    for (let i=0;i<this.listFiles.length;i++){
      var featureFormData:any=new FormData();

      featureFormData.append("idRow", this.listFiles[i].idRow);
      featureFormData.append("document",  this.listFiles[i].fileFeature);
      this.RequestService.post('http://localhost:8080/api/Document/uploadDetail',featureFormData).subscribe(
        {
          next:()=>{
            console.log('Archivo guardado'+ this.listFiles[i].idRow)
            this.openSnackBar();
            window.location.reload();
          },
          error:()=>{
            console.log('Archivo no guardado'+ this.listFiles[i].idRow)
          },
        })
    }

  }
  loadDataQuotationRegister(){
    this.RequestService.get('http://localhost:8080/api/quotation/getById/'+this.idQuot)
    .subscribe(r=>{
      this.load=true;
     // console.log(r);
      this.dataQuotation = r;
      let state=this.dataQuotation.state
      if(state == 'SIN COTIZAR'){
        this.business=this.dataQuotation.business
       // console.log("EMPRESA ->",this.business)
        this.priceQuotationDetail=this.lastQuotation.data.priceQuotationDetail
        this.lastQuotation.data.businessCompanyName=""
        this.quotationForm.setValue(this.lastQuotation.data)
        //console.log(typeof(this.priceQuotationDetail))
        }else if( state == 'COTIZADO' ){
          this.router.navigate(['/response-form']);
            }else if(state == 'INCOMPLETO'){
              this.router.navigate(['/response-form']);
              }else if(state == 'EXPIRADO'){
                this.router.navigate(['/error']);
      }
      //this.business=this.dataQuotation.business
    })
  }
  updateDataQuotation(){
    this.lastQuotation.data.total= this.getTotalCost();
    this.loadDataQuotationRegister()
  }
}
