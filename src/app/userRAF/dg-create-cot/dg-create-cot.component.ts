
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RequestService} from '../../services/request.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dg-create-cot',
  templateUrl: './dg-create-cot.component.html',
  styleUrls: ['./dg-create-cot.component.css']
})
export class DgCreateCotComponent implements OnInit {
  favoriteSeason: string;
  seasons: string[] = ['Cotizacion manual', 'Cotizacion digital'];
  quotationForm={idSpendingRequest:this.data.idSR};

  constructor(
    public dialogRef: MatDialogRef<DgCreateCotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private RequestService: RequestService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    console.log("Este es el id de la solicitud:",this.quotationForm);
  }
  createQuataion(){
    this.RequestService.post('http://localhost:8080/api/quotation',null)
    .subscribe(r =>{
      console.log('Solicitud enviada!!');

    })


  }

}
