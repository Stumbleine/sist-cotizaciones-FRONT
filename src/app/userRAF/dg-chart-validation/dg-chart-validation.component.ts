import { Component, OnInit } from '@angular/core';
import {RequestService} from 'src/app/services/request.service'
@Component({
  selector: 'app-dg-chart-validation',
  templateUrl: './dg-chart-validation.component.html',
  styleUrls: ['./dg-chart-validation.component.css']
})
export class DgChartValidationComponent implements OnInit {

  constructor(private RequestService: RequestService) { }
  public createchart=false
  ngOnInit(): void {
  }
  getStatus(){
    this.createchart=true
    this.RequestService.disparadorChart.emit(this.createchart)
  }
}
