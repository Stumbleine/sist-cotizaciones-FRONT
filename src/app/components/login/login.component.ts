import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {RequestService} from '../../services/request.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    username: ['',[Validators.required]],
    password: ['',[Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private RequestService: RequestService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onLogin(login,formDirective: FormGroupDirective){
    console.log(login)
    this.RequestService.post('http://localhost:8080/api/auth/authenticate',login)
    .subscribe( {
      next:(respuesta:any)=>{
        console.log(respuesta)
        formDirective.resetForm();
        this.cookieService.set('token',respuesta.jwt)
        this.sendRoute(respuesta.roles)
       },
      error:()=>{
       
      }
    });
      
  }
  sendRoute(roles: any){
    if(roles[0].authority=='ROLE_RAF'){
      this.router.navigate(['/','home-raf'])
    }else if(roles[0].authority=='ROLE_RUG'){
      this.router.navigate(['/','home-rug'])
    }else if(roles[0].authority=='ROLE_ADMIN'){
      this.router.navigate(['/','home-admin'])
    }
  }

}
