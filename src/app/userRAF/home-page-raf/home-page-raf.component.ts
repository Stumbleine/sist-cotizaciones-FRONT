import { Component, Input, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';

import { Observable, fromEvent, } from 'rxjs';
import { map, debounceTime,distinctUntilChanged } from 'rxjs/operators';

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
  public user:any;
  ngOnInit(): void {
    this.loadData();
    //this.iniciarW();
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
  //pedazo de codigo hermoso
  cols$ = this.subscribeToResize();

  private subscribeToResize(): Observable<number> {
    return fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        map((e: Event) => this.checkWidth(e.target as Window)),
        distinctUntilChanged(),
        map(isLaptop => isLaptop ? 1 : 2)
      );
  }

  private checkWidth(e: Window): boolean {
    return e.innerWidth <= 1600;
  }
}
