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
  @Input()
  type: string;
  sigla: string;
  username: string;
  amount:string;
  status:string;
  date:string;
}
