import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-qoatation-card',
  templateUrl: './qoatation-card.component.html',
  styleUrls: ['./qoatation-card.component.css']
})
export class QoatationCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() idQ:number
  @Input() nameCompany:string
  @Input() date:Date
  @Input() status:string

}
