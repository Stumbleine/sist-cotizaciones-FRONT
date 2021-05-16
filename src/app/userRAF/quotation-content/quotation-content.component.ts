import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-quotation-content',
  templateUrl: './quotation-content.component.html',
  styleUrls: ['./quotation-content.component.css']
})
export class QuotationContentComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute,) { }

  quotation:any;
  ngOnInit(): void {
    this.quotation= this.rutaActiva.snapshot.params.quotID;
  }

}
