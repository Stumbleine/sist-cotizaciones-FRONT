import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {



  constructor() { }

   @Input() transform:string;

  ngOnInit(): void {
  }

}
