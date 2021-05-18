import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-g',
  templateUrl: './dialog-g.component.html',
  styleUrls: ['./dialog-g.component.css']
})
export class DialogGComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogGComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  public idQuot=this.data.idQuot;
  public link:string="http://localhost:4200/cotizador/form-quotation/"+this.idQuot;
  ngOnInit(): void {
  }

}
