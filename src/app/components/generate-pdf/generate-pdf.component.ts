import { Component, OnInit } from '@angular/core';
import {PdfMakeWrapper, Txt, Table, Columns,DocumentDefinition} from 'pdfmake-wrapper'
@Component({
  selector: 'app-generate-pdf',
  templateUrl: './generate-pdf.component.html',
  styleUrls: ['./generate-pdf.component.css']
})
export class GeneratePdfComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  pdfBlob:any;
  gReport(){
    const pdf = new PdfMakeWrapper();
    pdf.add(
      new Txt('INFORME DE APROBACIOn').end

    );
    pdf.create().open()
    this.pdfBlob=pdf.create().getBlob(
      b=>{
        console.log(b)
      }
    );
    console.log("PDFBLOB",this.pdfBlob)
  }
}
