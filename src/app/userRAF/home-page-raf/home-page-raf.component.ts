import { Component, Input, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';

import { Observable, fromEvent, } from 'rxjs';
import { map, debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-home-page-raf',
  templateUrl: './home-page-raf.component.html',
  styleUrls: ['./home-page-raf.component.css']
})
export class HomePageRAFComponent implements OnInit {
  message="admin";
  constructor(
    private RequestService: RequestService,
    private snack:MatSnackBar,) { }
  public requestsReceived=null;
  public requestsReceivedCopy=null
  public status= "";
  public notRequest=false;
  public user:any;
  ngOnInit(): void {
    this.loadData();
    this.loadMonto();
    //this.iniciarW();
  }
  loadData(){
    this.user=JSON.parse(localStorage.getItem("user"))
    console.log(this.user.idUser)
    this.RequestService.get('http://localhost:8080/api/spendingUnit/allRequest/'+this.user.idUser)
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
  monto:any;
  montoUpdate:any;
  editMonto:boolean=false;
  loadMonto(){
    this.RequestService.get('http://localhost:8080/api/spendingUnit/getBudget/')
    .subscribe(r=>{
      console.log(r);
      this.monto = r;
    })
  }
  updateMonto(){
    var montoData=new FormData();
    console.log(this.montoUpdate)
    montoData.append('budget',this.montoUpdate);
    this.RequestService.put('http://localhost:8080/api/spendingUnit/updateBudget/',montoData)
    .subscribe({
      next:()=>{
        console.log('Monto actualizado!!');
        this.snack.open('Monto actualizado','CERRAR',{duration:5000,panelClass:'snackSuccess',})
        window.location.reload();
      },
      error:()=>{
        console.log('errroorr.');
        this.snack.open('Fallo al actualizar monto','CERRAR',{duration:5000})
      }
    })
  }
}
