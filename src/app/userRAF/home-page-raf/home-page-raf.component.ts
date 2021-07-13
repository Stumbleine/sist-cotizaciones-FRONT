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
  public requestsReceivedCopy=null
  public status= "";
  public notRequest=false;

  ngOnInit(): void {
    this.loadData();
  }
  loadData(){
    this.RequestService.get('http://localhost:8080/api/spendingUnit')
    .subscribe(r=>{
      console.log(r);
      this.requestsReceived = r;
      this.requestsReceivedCopy=r;
    })
  }
  filterBy(option){
    this.notRequest=false;
    this.status=option;
    if(this.status=="Todos" || this.status==""){
      this.requestsReceived=this.requestsReceivedCopy
    }else{
      this.requestsReceived=this.requestsReceivedCopy.filter(request => request.status=== this.status);
      if(this.requestsReceived.length==0){
        this.notRequest=true;
      }
    }
  }
}
