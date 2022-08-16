import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";


/** 
 * @desc: Protect all routes from being reached if user is not logged in
 */
@Injectable({providedIn:"root"})
export class AuthGuard implements CanActivate {

    jwt:JwtHelperService;
    constructor(private auth: AuthService, private router:Router){
        this.jwt = new JwtHelperService();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        if(!this.auth.authToken$.getValue() || this.jwt.isTokenExpired(this.auth.authToken$.getValue())){
            this.router.navigate(['login']);
            return false;
        }
        this.jwt.isTokenExpired(null)

        return true;
    }
}