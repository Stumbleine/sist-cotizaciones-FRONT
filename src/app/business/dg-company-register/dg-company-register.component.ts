import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dg-company-register',
  templateUrl: './dg-company-register.component.html',
  styleUrls: ['./dg-company-register.component.css']
})
export class DgCompanyRegisterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }
  razonSocial=this.data.razonsocial;
}
