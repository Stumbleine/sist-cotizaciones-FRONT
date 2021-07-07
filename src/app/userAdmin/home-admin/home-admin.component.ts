import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterUnidadComponent } from '../register-unidad/register-unidad.component';
import { RegisterRoleComponent } from '../register-role/register-role.component';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from '../../services/request.service';

export interface User{
  idUser: number;
  name: string;
  privileges: string[];
  role:string;
  spendingUnit:string;
}
@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

  constructor(public dialog: MatDialog, private RequestService: RequestService,) { }
  units:any;
  roles:any;
  usersResponse:any;
  users:User[]=[];

  displayedColumns: string[] = ['index', 'name', 'role', 'privileges','spendingUnit','actions'];
  dataSource =  new MatTableDataSource<User>([]);
  columnas=[
    {titulo:"NOMBRE USUARIO" ,name: "name"},
    {titulo:"USER ROL" ,name: "role"},
    {titulo:"PRIVILEGIOS" ,name: "privileges"},
    {titulo:"UNIDAD" ,name: "spendingUnit"},

  ];

  ngOnInit(): void {
    this.loadUnits();
    this.loadUsers();
    this.loadRoles();
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
      this.usersResponse=r;
      this.users=this.usersResponse;
      this.dataSource.data=this.users;
      console.log(this.users)
    })
  }

  loadRoles(){
    this.RequestService.get('http://localhost:8080/api/role/allRoles').subscribe(r=>{
      this.roles=r;
      console.log(this.units)
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
    this.dialog.open(RegisterUserComponent,{
      data:{
        unitList:this.units,
        roleList:this.roles,
      }
    });
  }
}
