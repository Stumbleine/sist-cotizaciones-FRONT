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
  
  ngOnInit(): void {
    this.loadData();
    //this.iniciarW();
  }
  loadData(){
    this.RequestService.get('http://localhost:8080/api/administration')
    .subscribe(r=>{
      console.log(r);
      this.requestsReceived = r;
    })
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
