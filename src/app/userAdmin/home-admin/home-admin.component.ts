import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterUnidadComponent } from '../register-unidad/register-unidad.component';
import { RegisterRoleComponent } from '../register-role/register-role.component';
import { RegisterUserComponent } from '../register-user/register-user.component';
@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  
  ngOnInit(): void {
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
