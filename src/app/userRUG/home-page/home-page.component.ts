import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
import { Observable, fromEvent, } from 'rxjs';
import { map, debounceTime,distinctUntilChanged } from 'rxjs/operators';

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
  public user:any={};
  public permits:any;
  public loadButton:boolean=false;
  public loadFile:boolean=false;
  public loadPedidos:boolean=false;
  ngOnInit(): void {
    this.getDataUser();
    this.loadData();
    this.loadMonto();
    //window.addEventListener('resize', this.screenW);
  }
  loadData(){
    this.RequestService.get('http://localhost:8080/api/spendingUnit/'+this.user.idUser)
    .subscribe(r=>{
      console.log(r);
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
  getDataUser(){
    this.user=JSON.parse(localStorage.getItem("user"))
    this.permits=JSON.parse(localStorage.getItem("permits"))
    this.permits.map(permit=>{
      if(permit.authority=="ROLE_CREAR_PEDIDO"){
        this.loadButton=true;
      }
      if(permit.authority=="ROLE_VER_PEDIDO"){
        this.loadPedidos=true;
      }
      if(permit.authority=="ROLE_VER_INFORME"){
        this.loadFile=true;
      }
    })
  }
  screenW(){

    const width:number=window.innerWidth;
    console.log(width)
    let res=2;
    if( width<1600){
     res =1;
    }
    return res;
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
  monto:any;
  loadMonto(){
    this.RequestService.get('http://localhost:8080/api/spendingUnit/getBudget/')
    .subscribe(r=>{
      console.log(r);
      this.monto = r;
    })
  }

  /*
  <mat-grid-list [cols]="cols$ | async"></mat-grid-list>
  */
}
