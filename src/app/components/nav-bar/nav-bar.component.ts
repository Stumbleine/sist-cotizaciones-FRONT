import { Component, OnInit,Input } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {



  constructor(private cookieService:CookieService,private requestService: RequestService) { }

   @Input() transform:string;
   @Input() nameUser:string;
  public user:any;
  ngOnInit(): void {
   this.getDataUser();
  }
  logout(){
    this.cookieService.delete('token','/','localhost',false,'Lax')
    localStorage.clear()
    window.location.reload();
  }
  getDataUser(){
    this.user=JSON.parse(localStorage.getItem("user"))
  }
}
