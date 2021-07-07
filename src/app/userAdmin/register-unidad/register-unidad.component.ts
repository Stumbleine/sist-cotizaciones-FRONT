import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, FormGroupDirective, Validators} from '@angular/forms';
import {RequestService} from '../../services/request.service';

import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-register-unidad',
  templateUrl: './register-unidad.component.html',
  styleUrls: ['./register-unidad.component.css']
})
export class RegisterUnidadComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    private snack:MatSnackBar,) { }

  facultieSelected="1"
  registerUnit= this.formBuilder.group({
    nameUnit:['',[Validators.required]],
    description:['',[Validators.required]],
    faculty:['',[Validators.required]],

  });


  ngOnInit(): void {
  }

  saveUnit(unit,formDirective: FormGroupDirective){
    console.log("Esta es a unidadRegistrar",unit);
    
    this.RequestService.post('http://localhost:8080/api/spendingUnit/registerSpendingUnit', unit)
    .subscribe({
      next:()=>{
        console.log('Unidad creada exitosamente!!');
        this.snack.open('Unidad registrada exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
        window.location.reload();
      },
      error:()=>{
        console.log('Ocurrio un error, no se creo la cotizacon.');
        this.snack.open('Fallo al registrar la Unidad','CERRAR',{duration:5000})
      }
    });
  }
}
