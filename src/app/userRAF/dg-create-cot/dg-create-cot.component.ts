
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-dg-create-cot',
  templateUrl: './dg-create-cot.component.html',
  styleUrls: ['./dg-create-cot.component.css']
})
export class DgCreateCotComponent implements OnInit {
  favoriteSeason: string;
  seasons: string[] = ['Cotizacion manual', 'Cotizacion digital'];

  constructor(
    public dialogRef: MatDialogRef<DgCreateCotComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }

}
