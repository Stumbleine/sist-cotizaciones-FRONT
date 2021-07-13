import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {RequestService} from '../../services/request.service';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  constructor(private RequestService: RequestService) { }
  public requestsSent=null
  public requestsSentCopy=null
  public status= "";
  public notRequest=false;

  ngOnInit(): void {
    this.loadData();
  }
  loadData(){
    this.RequestService.get('http://localhost:8080/api/spendingUnit/1')
    .subscribe(r=>{
      this.requestsSent = r;
      this.requestsSentCopy=r;
      
    })
  }
  filterBy(option){
    this.notRequest=false;
    this.status=option;
    if(this.status=="Todos" || this.status==""){
      this.requestsSent=this.requestsSentCopy
    }else{
      this.requestsSent=this.requestsSentCopy.filter(request => request.status=== this.status);
      if(this.requestsSent.length==0){
        this.notRequest=true;
      }
    }
  }
}
