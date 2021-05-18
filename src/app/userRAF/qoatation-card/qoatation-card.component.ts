import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qoatation-card',
  templateUrl: './qoatation-card.component.html',
  styleUrls: ['./qoatation-card.component.css']
})
export class QoatationCardComponent implements OnInit {

  constructor(private route:Router, ) { }

  ngOnInit(): void {

  }
  @Input() idSR:any
  @Input() quot:any;

  routerQuotation(status){
    if(status == 'SIN COTIZAR'){
      this.route.navigate(['/req-content', this.idSR ,'form-quotation',this.quot.idPriceQuotation]);

    }else if( status == 'COTIZADO' ){
      this.route.navigate(['/quot-content', this.quot.idPriceQuotation]);
    }else if(status == 'INCOMPLETO'){
      this.route.navigate(['/quot-content', this.quot.idPriceQuotation]);
    }else if(status == 'EXPIRADO'){
      this.route.navigate(['/error']);
    }
   // [routerLink]="['/quot-content', quot?.idPriceQuotation]"

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
