import { Component, OnInit,Inject } from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators,FormGroupDirective} from '@angular/forms';
import {RequestService} from '../../services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { map, } from 'rxjs/operators';
//import {generate} from 'generate-password'
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
    transform:any;
    roles:any;
    units:any;
    user:any;
  private isValidEmail:any=/\S+@\S+\.\S/;
  private isValidUserName:any=/^[a-zA-Z0-9]+$/;
  unitSelected="1"
  registerUser= this.formBuilder.group({
    name:['',[Validators.required]],
    password:['',[Validators.required]],
    email:['',[Validators.required,Validators.pattern(this.isValidEmail)]],
    idRole:['',[Validators.required]],
    idSpendingUnit:['',[Validators.required]],
    
    username:['',{
      validators:[Validators.required,Validators.pattern(this.isValidUserName)], 
      asyncValidators:[this.usernameCheck()],
        updateOn: 'blur'
    }],

  });
  editUser = this.formBuilder.group({
    name:['',[]],
    password:['',[]],
    email:['',[Validators.pattern(this.isValidEmail)]],
    username:['',{
      validators:[Validators.pattern(this.isValidUserName)], 
      asyncValidators:[this.usernameCheck()],
        updateOn: 'blur'
    }],
    idRole:['',[]],
  })
  hide = false;
  passwordGenerate:any=this.generatePassword(8);
  rolesDisp:any[]=[];

  ngOnInit(): void {
    this.transform=this.data.transform;
    this.roles=this.data.roleList;
    this.units=this.data.unitList;

    this.registerUser.controls['password'].setValue(this.passwordGenerate);

    if(this.transform=='edit'){
      this.user=this.data.user;
      this.fiterRoleType();
      this.editUser.controls['name'].setValue(this.user?.name);
      this.editUser.controls['password'].setValue(this.user?.password);
      this.editUser.controls['email'].setValue(this.user?.email);
      this.editUser.controls['username'].setValue(this.user?.username);

    }
    this.filterUnit();
  }
  
  fiterRoleType(){
    var userPrivileges=this.user.privileges;
    var privIdentifier= userPrivileges[0].identifier;
    console.log(privIdentifier);
    this.rolesDisp=this.filterRole(privIdentifier);
    console.log("RD -->",this.rolesDisp)
  }
  filterRole(ident){
    var role = this.roles.filter(function(role) {
      return role.privilegios[0].identifier === ident;
    });
    console.log("ROLES DISPONIBLES",role)
    return role;
  }

  rafUnits:any[]=[];
  rugUnits:any[]=[];
  typeUnit:string;
  //var generator = require('generate-password');

  changeType(e){
    console.log(e);
    if(e==1){
      this.typeUnit='1';
    }else{
      var role = this.roles.filter(function(role) {
        return role.idRole === e;
      });
      var privelegios:any=role[0].privilegios;
      this.typeUnit=privelegios[0].identifier;
     console.log(role)
     console.log(privelegios)
      console.log("TYPE UNIT",this.typeUnit)
    }
  }
  filterUnit(){
    for (let priv in this.units){
      if(this.units[priv].identifierUnit == '2'){
        this.rugUnits.push(this.units[priv]);
      }else if(this.units[priv].identifierUnit == '3'){
        this.rafUnits.push(this.units[priv]);
      } 
    }
    console.log('RAF __>',this.rafUnits);
    console.log('RUG __>',this.rugUnits)
  }


   generatePassword(passwordLength) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var allChars = numberChars + upperChars + lowerChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    return this.shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
  }
  
   shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  
  
  saveUser(user,formDirective: FormGroupDirective){
    console.log("Esta es a unidadRegistrar",user);
    
    this.RequestService.post('http://localhost:8080/api/user/registerUser', user)
    .subscribe({
      next:()=>{
        this.snack.open('Usuario registrada exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
        window.location.reload();
        console.log("LOG >>=",user);
    
      },
      error:()=>{
        this.snack.open('Fallo al registrar el usuario','CERRAR',{duration:5000})
      }
    });
  }
  saveEdit(update,formDirective: FormGroupDirective){
    
    this.RequestService.put('http://localhost:8080/api/user/updateDataUser/'+this.user?.idUser, update)
    .subscribe({
      next:()=>{
        this.snack.open('Usuario actualizado exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
        //window.location.reload();
      },
      error:()=>{
        this.snack.open('Fallo al actualizar el usuario','CERRAR',{duration:5000})
      }
    });
    console.log(update)
  }

  existUser:string;
  usernameCheck(): AsyncValidatorFn{

    return (control: AbstractControl) => {
      console.log(control.value)
      return this.RequestService.get('http://localhost:8080/api/user/uniqueUserName/'+control.value)
        .pipe(
          map((result) => (result==true) ?  null : {exist:!result})
        );
      
    };
  }

  getErrorMessageEmail(field: string,funct:string):string{
    let message;
    if(funct=='register'){
      if(this.registerUser.get(field).errors.required){
        message="Campo email es requerido"
      }else if(this.registerUser.get(field).hasError('pattern')){
        message="El email no es valido"
      }
    }else if(funct=='edit'){
      if(this.editUser.get(field).hasError('pattern')){
        message="El email no es valido"
      }
    }
    return message
  }
  getErrorMessage(field: string,funct:string):string{
    let message;
    //var valor=this.registerUser?.get(field)    console.log(valor)

    if(funct=='register'){
      if(this.registerUser?.get(field).errors?.required){
        message="Campo nombre de usuario es requerido"
      }else if(this.registerUser?.get(field).hasError('pattern')){
        message="nombre de usuario no es valido"
      }else if(this.registerUser?.get(field).hasError('exist')){
        message="nombre de usuario ya esta en uso"
      }
    }else if(funct=='edit'){

      if(this.editUser?.get(field).hasError('pattern')){
        message="nombre de usuario no es valido"
      }else if(this.editUser?.get(field).hasError('exist')){
        message="nombre de usuario ya esta en uso"
      }
    }
    return message
  }


  isValidField(field: string):boolean{
    return(
      (this.registerUser.get(field).touched || this.registerUser.get(field).dirty) &&
       !this.registerUser.get(field).valid
    )  }
    isValidFieldEdit(field: string):boolean{
      return(
        (this.editUser.get(field).touched || this.editUser.get(field).dirty) &&
         !this.editUser.get(field).valid
      )  }

}
