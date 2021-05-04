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


}
