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
  public req={}
  public sUR=this.req[0].spendingUnitRequestList;
  ngOnInit(): void {
    this.loadData();
  }
  loadData(){
    this.RequestService.get('http://localhost:8080/api/User')
    .subscribe(r=>{
      console.log(r);
      this.req = r;
    })
  }
}
