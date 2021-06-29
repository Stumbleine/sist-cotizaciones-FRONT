import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {RequestService} from '../../services/request.service';
import {map, startWith} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ElementSchemaRegistry } from '@angular/compiler';
@Component({
  selector: 'app-dg-company-register',
  templateUrl: './dg-company-register.component.html',
  styleUrls: ['./dg-company-register.component.css']
})
export class DgCompanyRegisterComponent implements OnInit {
  registerBusiness = this.formBuilder.group({
    nameBusiness: ['',],
    nameArea: ['',[Validators.required]],
    nit: ['',],
    eMail:['',[Validators.required]],
    address:['',],
    phone:['',[Validators.required]],
    description:['',[Validators.required]],
    idQuotation:[this.data.idQuotation,]
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private formBuilder: FormBuilder,
    private RequestService: RequestService,
    private snack:MatSnackBar,
    private route:Router,
    private dialogRef: MatDialogRef<DgCompanyRegisterComponent>) { }

  ngOnInit(): void {
    this.razonSocial=this.data.razonsocial;
    this.dataQuotation=this.data.quotation;
    console.log(this.dataQuotation)
    this.getAllAreas()

  }
  public razonSocial: any;
  public dataQuotation:any;
  //razonSocial=this.data.razonsocial;
  options: any;
  filteredOptions: Observable<string[]>;

  saveBusiness(business,formDirective: FormGroupDirective){
    if(this.razonSocial!=""){
      business.nameBusiness=this.razonSocial
    }
    business.nameArea
    business.nameArea=business.nameArea.toLowerCase()
    business.nameArea=business.nameArea.charAt(0).toUpperCase()+business.nameArea.slice(1);
    console.log(business)

    this.RequestService.post('http://localhost:8080/api/business/registerBusiness/', business)
    .subscribe({
      next:()=>{
        console.log('Cotizacion creada exitosamente!!');
        this.route.navigate(['/cotizador/form-quotation',this.data.idQuotation]);
        this.snack.open('Empresa registrada exitosamente.','CERRAR',{duration:5000,panelClass:'snackSuccess',})
        this.dialogRef.close();
        window.location.reload();
      },
      error:()=>{
        console.log('Ocurrio un error, no se creo la cotizacon.');
        this.snack.open('Fallo al registrar la Empresa, intente mas tarde.','CERRAR',{duration:5000})
      }
    });

  }
  getAllAreas(){
    this.RequestService.get('http://localhost:8080/api/area/getAllNameArea/').subscribe(r=>{
      this.options=r;
      this.filteredOptions = this.registerBusiness.get('nameArea').valueChanges
    .pipe(
      startWith(''),
      map(value => this.filter(value))
    );
    })
  }
  filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
