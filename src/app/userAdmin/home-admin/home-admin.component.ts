import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterUnidadComponent } from '../register-unidad/register-unidad.component';
import { RegisterRoleComponent } from '../register-role/register-role.component';
import { RegisterUserComponent } from '../register-user/register-user.component';

import {RequestService} from '../../services/request.service';


@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

  constructor(public dialog: MatDialog, private RequestService: RequestService,) { }
  units:any;
  users:any
  ngOnInit(): void {
    this.loadUnits();
  }

  //localhost:8080/api/user/allUsers
  loadUnits(){
    this.RequestService.get('http://localhost:8080/api/spendingUnit/allSpendingUnits').subscribe(r=>{
      this.units=r;
      console.log(this.units)
    })
  }
  loadUsers(){
    this.RequestService.get('http://localhost:8080/api/user/allUsers').subscribe(r=>{
      this.users=r;
      console.log(this.users)
    })
  }






  openRegisterUnidad(){
    this.dialog.open(RegisterUnidadComponent
    );
  }
  openRegisterRole(){
    this.dialog.open(RegisterRoleComponent);
  }
  openRegisterUser(){
    this.dialog.open(RegisterUserComponent);
  }
}
