import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RequestService} from '../../services/request.service';
@Component({
  selector: 'app-quotation-content',
  templateUrl: './quotation-content.component.html',
  styleUrls: ['./quotation-content.component.css']
})
export class QuotationContentComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute, private RequestService: RequestService,) { }

  idQuot:any;
  quotation:any;
  ngOnInit(): void {
    this.idQuot= this.rutaActiva.snapshot.params.quotID;
    this.getQuot(); 
  }
  getQuot(){
    this.RequestService.get('http://localhost:8080/api/quotation/getById/'+this.idQuot)
    .subscribe(r=>{
      this.quotation=r;
      console.log("Cotizacion : ",this.quotation);
    });
  }

}
