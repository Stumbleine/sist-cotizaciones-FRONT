import { Component, Input, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
@Component({
  selector: 'app-home-page-raf',
  templateUrl: './home-page-raf.component.html',
  styleUrls: ['./home-page-raf.component.css']
})
export class HomePageRAFComponent implements OnInit {
  message="admin";
  constructor(private RequestService: RequestService) { }
  public requestsReceived=null;
  
  ngOnInit(): void {
    this.loadData();
  }
  loadData(){
    this.RequestService.get('http://localhost:8080/api/administration')
    .subscribe(r=>{
      console.log(r);
      this.requestsReceived = r;
    })
  }
}
