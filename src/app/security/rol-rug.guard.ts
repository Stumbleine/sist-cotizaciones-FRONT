import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolRugGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const cookie= this.cookieService.check('token')
      const identifier= this.cookieService.get('identifier')
      /* if(!cookie ){
        this.router.navigate(['/','login'])
      }else{ */
        
          if(parseInt(identifier)==2){
            return true;
          }else{
            this.router.navigate(['/','login'])
          }
        
      
        
  }
  
}
