import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const rol= localStorage.getItem('rol')
    const pageActual=localStorage.getItem('pageActual')
    if(rol!=pageActual){
      
      this.router.navigate(['/','login'])
    }else{
      return true;
    }
  }
  
}
