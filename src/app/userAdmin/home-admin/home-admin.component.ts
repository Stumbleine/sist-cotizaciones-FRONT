import { Component, OnInit,Inject,ViewChild,ElementRef } from '@angular/core';

import { RegisterUnidadComponent } from '../register-unidad/register-unidad.component';
import { RegisterRoleComponent } from '../register-role/register-role.component';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { MatTableDataSource } from '@angular/material/table';
import {RequestService} from '../../services/request.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DgPrivelegesComponent } from 'src/app/componets/dg-priveleges/dg-priveleges.component';


export interface User{
  idUser: number;
  name: string;
  privileges: {};
  role:string;
  spendingUnit:string;
}
export interface Role{
  idRole:number;
  privilegios:{};
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
  idUser:any;
  userName:any;
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
    this.RequestService.disparadorDataUser.subscribe(dataUser=>{
      console.log(dataUser)
      this.idUser=dataUser.idUser;
      this.userName=dataUser.userName
    })
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
  openPriveleges(priv){
    this.dialog.open(DgPrivelegesComponent,{
      data:{
        privileges:priv
      }
    })
  }
}
/*
@Component({
  selector: 'app-dg-priveleges',
  template: `<div #el *ngFor="let priv of privileges">{{priv.privilege}}</div>`
})
export class dgPrivelegesComponent implements OnInit {
  @ViewChild('el') div:ElementRef;
  ngAfterViewInit(){
    this.div.nativeElement.setAttribute('highlight', '');
  } 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
    privileges:any;
  ngOnInit(): void {
    this.privileges=this.data.privileges;
    console.log(this.privileges);
  }

}*/