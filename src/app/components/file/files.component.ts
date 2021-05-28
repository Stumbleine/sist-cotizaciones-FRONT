import { Component, Input, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  constructor(    private RequestService: RequestService,) { }


  @Input() code;
  @Input() name
  @Input() idSR;
  @Input() idQuot;

  ngOnInit(): void {
    if(this.code==="reportPedido"){
      this.getPDFReport()
    }else{
      if(this.code==="documentQuot"){
        this.getDocumentQuot()
      }
    }

    
  }
  

  /*getReporte(id){
    this.RequestService.get('http://localhost:8080/api/report/'+id)
    .subscribe(r  =>{
      this.report=r;
      console.log("REPORTE",this.report);
      this.document=this.report.documentQuotationAtributesOutput;
    });
  }*/
  //REPORTE PEDIDO
    data:any;
    getPDFReport(){
      this.RequestService.get('http://localhost:8080/api/Document/Report/'+this.idSR)
      .subscribe(file=>{
      this.data=file;
      })
    }
    getPDF_blob(){
      this.RequestService.getFile('http://localhost:8080/api/Document/blob/Report/'+this.idSR).subscribe(blob=>{
      let pdf = new Blob([blob],{type: 'application/pdf'});
      let fileData = new File([pdf], "name", {type: 'application/pdf'});
      let fileURL = window.URL.createObjectURL(fileData);
      window.open(fileURL,"_blank")
      //saveAs(blob, data?.nameDocumenQuotaion);
      })
    }

    //DocumentEscaneado.
    dataFile:any;
    getDocumentQuot(){
      this.RequestService.get('http://localhost:8080/api/Document/Quotation/'+this.idQuot)
      .subscribe(file=>{
          this.dataFile=file;
          console.log('FILE :', this.dataFile);
      })
    }

    //DocumentEscaneado UPLOADER
    getQuotPDF_blob(){
      this.RequestService.getFile('http://localhost:8080/api/Document/blob/Quotation/'+this.idQuot)
      .subscribe(blob=>{
        let pdf = new Blob([blob],{type: 'application/pdf'});
        let fileData = new File([pdf], "name", {type: 'application/pdf'});
        let fileURL = window.URL.createObjectURL(fileData);
        window.open(fileURL,"_blank")
        //saveAs(blob, data?.nameDocumenQuotaion);
        })
    }
}