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
  unitPrice : number,
  totalPrice : number,
}
type TableRow=[number,number,string,string,number,number]

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
    quotation.priceQuotationDetail.map(detail=>{
      if(detail.unitPrice == null){
         quotation.state='INCOMPLETO'
      }
    })
    this.RequestService.put('http://localhost:8080/api/quotation/updateQuotation/'+this.idQuot,quotation)
    .subscribe( respuesta =>{
      console.log('Solicitud enviada!!');
      this.openSnackBar();
      
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
       window.location.reload();
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

  async printForm(){
    const pdf=new PdfMakeWrapper();
    pdf.pageMargins([0,0,0,0])
    pdf.pageSize('letter')
    pdf.pageOrientation('portrait')
    if(this.thereIsBusiness()){
      pdf.add(
        new Canvas([
          new Rect([0,0],[612,45]).color('#700aff').end,
          new Line([10,250],[600,250]).color('#c2c2c2').end,
          new Rect([130,85],[380,25]).color('white').lineColor('#c2c2c2').round(5).end,
    
          new Rect([105,150],[10,10]).color('white').lineColor('#c2c2c2').end,
          new Rect([105,170],[10,10]).color('white').lineColor('#c2c2c2').end,
          new Rect([105,190],[10,10]).color('white').lineColor('#c2c2c2').end,
          
          new Rect([410,120],[130,25]).color('white').lineColor('#c2c2c2').round(5).end,
          new Rect([425,160],[130,25]).color('white').lineColor('#c2c2c2').round(5).end,
          new Rect([380,200],[130,25]).color('white').lineColor('#c2c2c2').round(5).end,
          new Rect([70,500],[440,60]).color('white').lineColor('#c2c2c2').round(5).end,
          
          
        ]).end
        
        
      )
      pdf.add( await (await new Img('../../../assets/icon.PNG').absolutePosition(5,3).height(40).width(35).build()));
      pdf.add(new Txt('FORMULARIO DE COTIZACION').absolutePosition(40,10).fontSize(13).bold().color('white').font('Roboto').end)
      pdf.add(new Txt('Moneda(Bs)').absolutePosition(40,28).fontSize(9).color('white').font('Roboto').end)
      pdf.add(new Txt('Información de la cotización').alignment("center").absolutePosition(0,50).fontSize(12).color('black').font('Roboto').bold().end)
      pdf.add(new Txt('Razón Social:').absolutePosition(70,90).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('Forma de Pago:').absolutePosition(70,130).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('A Crédito').absolutePosition(120,150).fontSize(9).color('black').font('Roboto').end)
      pdf.add(new Txt('Al Contado').absolutePosition(120,170).fontSize(9).color('black').font('Roboto').end)
      pdf.add(new Txt('Al Contado y a Crédito').absolutePosition(120,190).fontSize(9).color('black').font('Roboto').end)
      pdf.add(new Txt('Tiempo de Entrega(días):').absolutePosition(296,125).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('Tiempo de Garantía(meses):').absolutePosition(296,165).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('Validez de Oferta:').absolutePosition(296,205).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('Detalle del item/articulo/bien/servicio').alignment("center").absolutePosition(0,265).fontSize(12).color('black').font('Roboto').bold().end)
      pdf.add(this.createTable(this.priceQuotationDetail))
      pdf.add(new Txt('Ingrese un comentario:').absolutePosition(70,480).fontSize(9).color('black').font('Roboto').end)
      
      pdf.create().print();
    
    }else{

      pdf.add(
        new Canvas([
          new Rect([0,0],[612,45]).color('#700aff').end,
          new Line([10,200],[600,200]).color('#c2c2c2').end,
          new Line([10,410],[600,410]).color('#c2c2c2').end,
    
          new Rect([105,275],[10,10]).color('white').lineColor('#c2c2c2').end,
          new Rect([105,295],[10,10]).color('white').lineColor('#c2c2c2').end,
          new Rect([105,315],[10,10]).color('white').lineColor('#c2c2c2').end,
          
          new Rect([410,250],[130,25]).color('white').lineColor('#c2c2c2').round(5).end,
          new Rect([425,285],[130,25]).color('white').lineColor('#c2c2c2').round(5).end,
          new Rect([380,330],[130,25]).color('white').lineColor('#c2c2c2').round(5).end,
          new Rect([70,620],[440,60]).color('white').lineColor('#c2c2c2').round(5).end,
          
          
        ]).end
        
        
      )
      pdf.add( await (await new Img('../../../assets/icon.PNG').absolutePosition(5,3).height(40).width(35).build()));
      pdf.add(new Txt('FORMULARIO DE COTIZACION').absolutePosition(40,10).fontSize(13).bold().color('white').font('Roboto').end)
      pdf.add(new Txt('Moneda(Bs)').absolutePosition(40,28).fontSize(9).color('white').font('Roboto').end)
      pdf.add(new Txt('Información de la empresa').alignment("center").absolutePosition(0,50).fontSize(12).color('black').font('Roboto').bold().end)
      pdf.add(new Txt('Razón Social:').absolutePosition(70,90).fontSize(10).color('black').font('Roboto').bold().end)
      pdf.add(new Txt(this.business.name).absolutePosition(135,90).fontSize(10).color('black').font('Roboto').color('#666666').end)
      pdf.add(new Txt('NIT:').absolutePosition(70,110).fontSize(10).color('black').font('Roboto').bold().end)
      pdf.add(new Txt(this.business.nit).absolutePosition(100,110).fontSize(10).color('black').font('Roboto').color('#666666').end)
      pdf.add(new Txt('e-mail:').absolutePosition(70,130).fontSize(10).color('black').font('Roboto').bold().end)
      pdf.add(new Txt(this.business.eMail).absolutePosition(110,130).fontSize(10).color('black').font('Roboto').color('#666666').end)
      pdf.add(new Txt('Teléfono:').absolutePosition(70,150).fontSize(10).color('black').font('Roboto').bold().end)
      pdf.add(new Txt(this.business.phone).absolutePosition(115,150).fontSize(10).color('black').font('Roboto').color('#666666').end)
      pdf.add(new Txt('Dirección:').absolutePosition(70,170).fontSize(10).color('black').font('Roboto').bold().end)
      pdf.add(new Txt(this.business.adress).absolutePosition(120,170).fontSize(10).color('black').font('Roboto').color('#666666').end)
      pdf.add(new Txt('Información de la cotización').alignment("center").absolutePosition(0,210).fontSize(12).color('black').font('Roboto').bold().end)
      pdf.add(new Txt('Forma de Pago:').absolutePosition(70,255).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('A Crédito').absolutePosition(120,275).fontSize(9).color('black').font('Roboto').end)
      pdf.add(new Txt('Al Contado').absolutePosition(120,295).fontSize(9).color('black').font('Roboto').end)
      pdf.add(new Txt('Al Contado y a Crédito').absolutePosition(120,315).fontSize(9).color('black').font('Roboto').end)
      pdf.add(new Txt('Tiempo de Entrega(días):').absolutePosition(296,255).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('Tiempo de Garantía(meses):').absolutePosition(296,295).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('Validez de Oferta:').absolutePosition(296,335).fontSize(10).color('black').font('Roboto').end)
      pdf.add(new Txt('Detalle del item/articulo/bien/servicio').alignment("center").absolutePosition(0,420).fontSize(12).color('black').font('Roboto').bold().end)
      pdf.add(this.createTableWith(this.priceQuotationDetail))
      pdf.add(new Txt('Ingrese un comentario:').absolutePosition(70,600).fontSize(9).color('black').font('Roboto').end)
        
      pdf.create().print();

}




}

createTable(data: Item[]):ITable{
  [{}]
    return new Table([
    [ 'Nro', 'CANTIDAD','UNIDAD','DETALLE','PRECIO UNITARIO','SUBTOTAL'],
    ...this.extractData(data),
  ]).absolutePosition(70,310).alignment('center').fontSize(10).layout({hLineColor:(rowIndex:number,node:any,columnIndex:number)=>{
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
      [ 'Nro', 'CANTIDAD','UNIDAD','DETALLE','PRECIO UNITARIO','SUBTOTAL'],
      ...this.extractData(data),
    ]).absolutePosition(70,460).alignment('center').fontSize(10).layout({hLineColor:(rowIndex:number,node:any,columnIndex:number)=>{
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
    return data.map(row=>[index++,row.quantity,row.unit,row.description,row.unitPrice,row.totalPrice])
}

}
