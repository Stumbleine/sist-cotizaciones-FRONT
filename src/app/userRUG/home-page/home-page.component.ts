import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor(private RequestService: RequestService) { }
  public requestsSent=null

  ngOnInit(): void {
    this.loadData();
  }
  loadData(){
    this.RequestService.get('http://localhost:8080/api/spendingUnit/1')
    .subscribe(r=>{
      console.log(r);
      this.requestsSent = r;
    })
  }
}
