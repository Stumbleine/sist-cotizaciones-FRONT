import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-validation-cancel',
  templateUrl: './dialog-validation-cancel.component.html',
  styleUrls: ['./dialog-validation-cancel.component.css']
})
export class DialogValidationCancelComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  goForm(){
    this.router.navigate(['/cotizador/form-quotation']);
    window.location.reload();
  }
}
