import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterUnidadComponent } from '../register-unidad/register-unidad.component';
import { RegisterRoleComponent } from '../register-role/register-role.component';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from '../../services/request.service';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';

export interface User{
  idUser: number;
  name: string;
  privileges: string[];
  role:string;
  spendingUnit:string;
}
export interface Role{
  idRole:number;
  privilegios:string[];
  roleName:string;
}


@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

  constructor(public dialog: MatDialog, private RequestService: RequestService,) { }
  units:any;
  rolesResponse:any;
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
  roles:Role[]=[];

  displayedColumnsRole: string[] = ['index', 'roleName','privileges', 'actions'];
  dataSourceRole =  new MatTableDataSource<Role>([]);
  columnasRole=[
    {titulo:"NOMBRE ROL" ,name: "roleName"},
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
      console.log("Unidades ",this.units)
    })
  }
  loadUsers(){
    this.RequestService.get('http://localhost:8080/api/user/allUsers').subscribe(r=>{
      this.usersResponse=r;
      this.users=this.usersResponse;
      this.dataSource.data=this.users;
      console.log("USERS ",this.users)
    })
  }

  loadRoles(){
    this.RequestService.get('http://localhost:8080/api/role/allRoles').subscribe(r=>{
      this.rolesResponse=r;
      this.roles=this.rolesResponse;
      this.dataSourceRole.data=this.roles;
      console.log("ROLES ",this.roles)
    })
  }




  openRegisterUnidad(){
    this.dialog.open(RegisterUnidadComponent,
      {
        data:{
          transform:'register'
        }
      }
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
        user:null,
        transform:'register',
      }
    });
  }
  openEditUser(user){
    this.dialog.open(RegisterUserComponent,{
      data:{
        unitList:this.units,
        roleList:this.roles,
        user:user,
        transform:'edit',
      }
    });
  }

  openAssignement(employees){
    this.dialog.open(RegisterUnidadComponent,
      {
        data:{
          transform:'assig',
          employees:employees,
        }
      }
      );
  }
}
