import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-qoatation-card',
  templateUrl: './qoatation-card.component.html',
  styleUrls: ['./qoatation-card.component.css']
})
export class QoatationCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log(this.quot);
    console.log(this.idQ);
  }
  @Input() idQ:number
  @Input() nameCompany:string
  @Input() date:Date
  @Input() status:string
  @Input() quot:any;

  sendDataView(){
    
  }

  getColor(status){
    let color:string;
    if (status=='SIN COTIZAR') {
      color = '#f7f7f7'
    } else if (status=='COTIZADO') {
        color = 'rgb(74 255 70 / 73%)';
      }else if(status=='EXPIRADO'){
        color= 'rgb(255 143 133 / 90%)';
      }else if(status=='INCOMPLETO'){
        color ='#FFF176';
      }
    return color;
  }
}
