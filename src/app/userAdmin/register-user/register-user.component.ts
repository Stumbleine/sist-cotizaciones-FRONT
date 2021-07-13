import { Component, OnInit,Inject } from '@angular/core';
import {FormControl, FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {RequestService} from '../../services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    private snack:MatSnackBar,
  ) { }
    roles:any;
    units:any;
  private isValidEmail:any=/\S+@\S+\.\S/;
  private isValidUserName:any=/^[a-zA-Z0-9]+$/;
  unitSelected="1"
  registerUser= this.formBuilder.group({
    name:['',[Validators.required]],
    password:['',[Validators.required]],
    username:['',[Validators.required,Validators.pattern(this.isValidUserName)]],
    idRole:['',[Validators.required]],
    idSpendingUnit:['',[Validators.required]],

  });
  hide = true;
  ngOnInit(): void {
    this.roles=this.data.roleList;
    this.units=this.data.unitList;
    console.log("UNIDADES  _>",this.units)
    console.log("ROLES ->",this.roles)

  }

  saveUnit(user,formDirective: FormGroupDirective){
    console.log("Esta es a unidadRegistrar",user);
    
    this.RequestService.post('http://localhost:8080/api/user/registerUser', user)
    .subscribe({
      next:()=>{
        console.log('Unidad creada exitosamente!!');
        this.snack.open('Usuario registrada exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
        //window.location.reload();
      },
      error:()=>{
        console.log('Ocurrio un error, no se creo la cotizacon.');
        this.snack.open('Fallo al registrar el usuario','CERRAR',{duration:5000})
      }
    });
  }
  existUser:string;
  validUsername(){
    this.RequestService.get('http://localhost:8080/api/user/uniqueUserName/'+this.existUser).subscribe(r=>{
      console.log(r);
    })  
  }
  getErrorMessage(field: string):string{
    let message;
    if(this.registerUser.get(field).errors.required){
      message="Campo username es requerido"
    }else if(this.registerUser.get(field).hasError('pattern')){
      message="El campo username no es valido"
    }
    return message
  }


  isValidField(field: string):boolean{
    return(
      (this.registerUser.get(field).touched || this.registerUser.get(field).dirty) &&
       !this.registerUser.get(field).valid
    )
  }

}
