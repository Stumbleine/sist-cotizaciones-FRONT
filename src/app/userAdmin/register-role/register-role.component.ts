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
  privilegeSelected=new FormControl();

  registerRole= this.formBuilder.group({
    roleName:['',[Validators.required]],
    description:['',[Validators.required]],
    privileges:['',[Validators.required]]
  });

  facultieSelected="none"
  typeUnit:string;
  privilegesList:any;
  privilegesRAF:any[]=[];
  privilegesRUG:any[]=[];
  //privilegesRUG:string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  checked = false;
  ngOnInit(): void {
    this.loadPrivileges();
    

  }
  printType(e){
    console.log(e,this.typeUnit);
  }
  print(e){
    console.log(e);
    console.log('formControl asasdas',this.privilegeSelected);
  }
  loadPrivileges(){
    this.RequestService.get('http://localhost:8080/api/privilege/allPrivileges').subscribe(r=>{
      this.privilegesList=r;
      console.log(this.privilegesList);
      this.filterPrivileges();
    })
  }

  filterPrivileges(){
    for (let priv in this.privilegesList){
      if(this.privilegesList[priv].identifier == '2'){
        this.privilegesRUG.push(this.privilegesList[priv]);
      }else if(this.privilegesList[priv].identifier == '3'){
        this.privilegesRAF.push(this.privilegesList[priv]);
      } 
    }
    console.log('RAF __>',this.privilegesRAF);
    console.log('RUG __>',this.privilegesRUG)
  }
  ss(role,formDirective: FormGroupDirective){
    console.log("ROLE REGISTRADO >>>>>>>>>>",role)
  }
  saveRole(role,formDirective: FormGroupDirective){
    this.RequestService.post('http://localhost:8080/api/role/registerRole',role).subscribe({
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
