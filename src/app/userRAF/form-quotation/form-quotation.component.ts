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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {PdfMakeWrapper,Canvas, Rect,Img,Line,Txt,Table} from 'pdfmake-wrapper'
import {ITable} from 'pdfmake-wrapper/lib/interfaces'

export interface Item{
  quantity : number,
  unit : string,
  description : string,
  features:string,

  unitPrice : number,
  totalPrice : number,
}
type TableRow=[number,number,string,string,string,number,number]



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
    private route:Router,
  ) { }
  priceQuotationDetail: Item[] = [];
  i=0;
  itemForm = this.formBuilder.group({
    quantity: ['',[Validators.required]],
    unit: ['',[Validators.required]],
    features:[''],
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


  displayedColumns: string[] = ['index', 'quantity', 'unit', 'description','features','unitPrice','totalPrice'];
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
  public idSR:any;
  ngOnInit(): void {

    this.idQuot= this.rutaActiva.snapshot.params.idQ;
    this.idSR= this.rutaActiva.snapshot.params.idSR;
    this.loadDataQuotation();
    this.getFiles()
    console.log("asasas",this.idQuot)
  }
  dataFile:any;
  getFiles(){
    this.RequestService.get('http://localhost:8080/api/Document/Quotation/'+this.idQuot)
    .subscribe(file=>{
        this.dataFile=file;
        console.log('FILE :', this.dataFile);
    })
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
  
  reOpen(agreed:boolean){
    if(agreed==true){    
      this.openUploader()  
    }
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
    validPDFupload=false;
  saveQuotation(quotation,formDirective1: FormGroupDirective){
    if(this.dataFile!=null){
      quotation.priceQuotationDetail=this.priceQuotationDetail
      quotation.total= this.getTotalCost(); 
      console.log(quotation);
      if(quotation.businessCompanyName!=""){
        this.saveQuotationSinBusiness(quotation,formDirective1)
      }else{
          quotation.priceQuotationDetail.map(detail=>{
            if(detail.unitPrice == null){
              quotation.state='INCOMPLETO'
            }
          })

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
                setTimeout(()=>{
                  this.route.navigate(['/req-content',this.idSR]);
                },3000)
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
  }else{
    this.validPDFupload=true;
  }
  }
  saveQuotationSinBusiness(quotation,formDirective1: FormGroupDirective){
    
    if(this.dataFile!=null){

    
      quotation.priceQuotationDetail.map(detail=>{
        if(detail.unitPrice == null){
          quotation.state='INCOMPLETO'
        }
      })
      this.RequestService.put('http://localhost:8080/api/quotation/updateQuotation/'+this.idQuot,quotation)
      .subscribe( respuesta =>{
        console.log('Solicitud enviada!!');
        this.openSnackBar();
        setTimeout(()=>{
          this.route.navigate(['/req-content',this.idSR]);
        },3000)
        
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
    }else{
      this.validPDFupload=true;
    }  
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


  //imprimir
  thereIsBusiness():boolean{
    if(this.load==true){
      if(this.business==null){
        return true;
      }else{
        return false;
      }
    }
    
  }

  async printForm(){
    const pdf=new PdfMakeWrapper();
    pdf.pageMargins([0,20,0,0])
    pdf.pageSize('A4')
    pdf.defaultStyle({
      fontSize:11,
      //font:'roboto'
    })
    if(this.thereIsBusiness()){
      pdf.add(new Txt('UNIVERSIDAD MAYOR DE SAN SIMÓN').margin([20,0]).bold().fontSize(13).end);
      pdf.add(new Txt('ADQUISICIONES').margin([20,0]).bold().fontSize(13).end);
      pdf.add(new Txt('Teléfono: 4250660 ; 4232198').margin([20,0]).fontSize(10).end);
      pdf.add(new Txt('Fax: 4231765 ; Casilla 992').margin([20,0]).fontSize(10).end);
      pdf.add(new Txt('Cochabamba - Bolivia').margin([20,0]).fontSize(10).end);

      pdf.add(new Txt('SOLICITUD DE COTIZACIÓN').bold().alignment('center').fontSize(13).end);
      pdf.add(new Txt('Moneda (Bs)').bold().alignment('center').fontSize(12).end);
      pdf.add(pdf.ln(1));
      pdf.add(new Txt('Razon Social: ...........................................................................................\
      Fecha: ............./............./............./').margin([20,10]).end);
      pdf.add(new Txt('Agradecemos a Uds. cotizarnos, los articulos que a continuacion se  detallan. Luego este formulario debe devolverse en sobre cerrado debidamente FIRMADO y SELLADO (favor especificar Marca, Modelo, Industria)')
         .margin([30,0]).fontSize(9).end);
      
      pdf.add(this.createTable(this.priceQuotationDetail))
      pdf.add(new Txt('Tiempo de entrega (dias): .....................................................    Validez de oferta:   ............./............./............./').margin([20,5]).end);
      pdf.add(new Txt('Tiempo de garantia (meses): ................................................ ').margin([20,5]).end);
      //pdf.add(new Txt('Validez de oferta:   ............./............./............./').margin([20,5]).end);
      pdf.add(new Txt('Forma de pago: ').margin([20,5]).end);
      pdf.add(new Txt('(  ) A Crédito').margin([120,5]).end)
      pdf.add(new Txt('(  )  Al Contado').margin([120,5]).end)
      pdf.add(new Txt('(  )  Al Contado y a Crédito').margin([120,5]).end)
      pdf.add(new Txt('Comentarios:').margin([20,10]).end)
      pdf.add(new Canvas([new Rect([30,5],[540,70]).color('white').lineColor('#c2c2c2').round(5).end]).end)
      pdf.create().print();
    
    }else{
      pdf.add(new Txt('UNIVERSIDAD MAYOR DE SAN SIMÓN').margin([20,0]).bold().fontSize(13).end);
      pdf.add(new Txt('ADQUISICIONES').margin([20,0]).bold().fontSize(13).end);
      pdf.add(new Txt('Teléfono: 4250660 ; 4232198').margin([20,0]).fontSize(10).end);
      pdf.add(new Txt('Fax: 4231765 ; Casilla 992').margin([20,0]).fontSize(10).end);
      pdf.add(new Txt('Cochabamba - Bolivia').margin([20,0]).fontSize(10).end);

      pdf.add(new Txt('SOLICITUD DE COTIZACIÓN').bold().alignment('center').fontSize(13).end);
      pdf.add(new Txt('Moneda (Bs)').bold().alignment('center').fontSize(12).end);
      pdf.add(pdf.ln(1));
      pdf.add(new Txt('Razon Social: '+this.business.name).margin([20,10]).end);
      pdf.add(new Txt('NIT: '+this.business.NIT).margin([20,10]).end);
      pdf.add(new Txt('Fecha: ............./............./............./'+this.business.name).margin([20,10]).end);
      pdf.add(new Txt('Agradecemos a Uds. cotizarnos, los articulos que a continuacion se  detallan. Luego este formulario debe devolverse en sobre cerrado debidamente FIRMADO y SELLADO (favor especificar Marca, Modelo, Industria)')
         .margin([30,0]).fontSize(9).end);


      pdf.add(this.createTableWith(this.priceQuotationDetail))
      pdf.add(new Txt('Tiempo de entrega (dias): .....................................................    Validez de oferta:   ............./............./............./').margin([20,5]).end);
      pdf.add(new Txt('Tiempo de garantia (meses): ................................................ ').margin([20,5]).end);
      //pdf.add(new Txt('Validez de oferta:   ............./............./............./').margin([20,5]).end);
      pdf.add(new Txt('Forma de pago: ').margin([20,5]).end);
      pdf.add(new Txt('(  ) A Crédito').margin([120,5]).end)
      pdf.add(new Txt('(  )  Al Contado').margin([120,5]).end)
      pdf.add(new Txt('(  )  Al Contado y a Crédito').margin([120,5]).end)
      pdf.add(new Txt('Comentarios:').margin([20,10]).end)
      pdf.add(new Canvas([new Rect([30,5],[540,70]).color('white').lineColor('#c2c2c2').round(5).end]).end)
      pdf.create().print();

}

//   


}

createTable(data: Item[]):ITable{
  [{}]
    return new Table([
    [ 'Nro', 'CANTIDAD','UNIDAD','DETALLE','_CARACTERISTICAS_','PRECIO UNITARIO','SUBTOTAL'],
    ...this.extractData(data),
  ]).margin([20,10]).alignment('center').fontSize(10).layout({hLineColor:(rowIndex:number,node:any,columnIndex:number)=>{
          return  '#c2c2c2';
  },vLineColor:((rowIndex:number,node:any,columnIndex:number)=>{
      return  '#c2c2c2';
  }),fillColor:((rowIndex:number,node:any,columnIndex:number)=>{
      return  rowIndex===0?'#c2c2c2':'';
  })
  }).end;
}
createTableWith(data: Item[]):ITable{
    [{}]
    return new Table([
      [ 'Nro', 'CANTIDAD','UNIDAD','DETALLE','CARACTERISTICAS','PRECIO UNITARIO','SUBTOTAL'],
      ...this.extractData(data),
    ]).margin([20,10]).alignment('center').fontSize(10).layout({hLineColor:(rowIndex:number,node:any,columnIndex:number)=>{
      return  '#c2c2c2';
    },vLineColor:((rowIndex:number,node:any,columnIndex:number)=>{
      return  '#c2c2c2';
    }),fillColor:((rowIndex:number,node:any,columnIndex:number)=>{
      return  rowIndex===0?'#c2c2c2':'';
    })
    }).end; 
}
extractData(data:Item[]):TableRow[]{
    var index=1
    return data.map(row=>[index++,row.quantity,row.unit,row.description,row.features,row.unitPrice,row.totalPrice])
}

}
