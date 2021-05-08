import { Component, OnInit,Input } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogRequestedComponent} from '../dialog-requested/dialog-requested.component'

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css']
})
export class SummaryCardComponent implements OnInit {

  constructor( 
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
  }
  @Input() type: string;
  @Input() nro:string;
  @Input() sigla: string;
  @Input() username: string;
  @Input() amount:string;
  @Input() status:string;
  @Input() date:string;

  openDialog() {
    this.dialog.open(DialogRequestedComponent,{
    width: '70%',
    data: { nro:this.nro }
    });
  }
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