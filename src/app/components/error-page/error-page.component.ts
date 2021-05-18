import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute, ) { }

  idSR:any;
  ngOnInit(): void {
    this.idSR=this.rutaActiva.snapshot.params.idSR;
  }

}
