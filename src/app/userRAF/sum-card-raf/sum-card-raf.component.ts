import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-sum-card-raf',
  templateUrl: './sum-card-raf.component.html',
  styleUrls: ['./sum-card-raf.component.css']
})
export class SumCardRafComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() type: string;
  @Input() nro:string;
  @Input() sigla: string;
  @Input() username: string;
  @Input() amount:string;
  @Input() status:string;
  @Input() date:string;
  getColorSR(status){
    let color:string;
    if (status=='Pendiente') {
      color = '#979797';
    } else if (status=='Autorizado') {
        color = '#1975ff';
      }else if(status=='Cotizando'){
        color= '#ffc400';
      }else if(status=='Rechazado'){
        color= '#ff4848';
      }else if(status=='Aprobado'){
        color = '#28a745'
      }
    return color;
  }

}
