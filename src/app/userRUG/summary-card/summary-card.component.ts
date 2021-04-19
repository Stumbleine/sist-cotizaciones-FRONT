import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.css']
})
export class SummaryCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() type: string;
  @Input() sigla: string;
  @Input() username: string;
  @Input() amount:string;
  @Input() status:string;
  @Input() date:string;
}
