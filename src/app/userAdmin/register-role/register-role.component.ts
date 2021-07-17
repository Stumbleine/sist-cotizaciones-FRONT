import { Component, OnInit } from '@angular/core';
import {RequestService} from '../../services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators,FormGroupDirective} from '@angular/forms';
@Component({
  selector: 'app-register-role',
  templateUrl: './register-role.component.html',
  styleUrls: ['./register-role.component.css']
})
export class RegisterRoleComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    private snack:MatSnackBar
  ) { }

  registerUser= this.formBuilder.group({
    roleName:['',[Validators.required]],
    description:['',[Validators.required]],
  });

  facultieSelected="none"
  typeUnit:string;
  privilegesList:any;
  privilegesRAF:any;
  privilegesRUG:any;
  privigeleSelected=new FormControl();
  ngOnInit(): void {
    this.loadPrivileges();
    this.filterPrivileges();

  }
  loadPrivileges(){

  }

  filterPrivileges(){
    for (let quot in this.privilegesList){
      if(this.privilegesList[quot].function == '2'){
        this.privilegesRAF.push(this.privilegesList[quot]);
      }else if(this.privilegesList[quot].function == '1'){
        this.privilegesRAF.push(this.privilegesList[quot]);
      } 
    }
  }

  saveRole(){
    this.RequestService.post('http://localhost:8080/api/role/registerRole',{}).subscribe({
      next:()=>{
        this.snack.open('Usuario registrada exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
        //window.location.reload();
        console.log('exito registrar role');
    
      },
      error:()=>{
        this.snack.open('Fallo al registrar el usuario','CERRAR',{duration:5000});
        console.log('error registrar role');
      }
    })
  }
}
