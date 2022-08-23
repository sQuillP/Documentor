import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ENDPOINT = "http://localhost:5000/api/v1/auth";
  private jwt:JwtHelperService;

  authToken$:BehaviorSubject<string>;
  userId$:BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.jwt = new JwtHelperService();
    let decodedId = null;
    if(localStorage.getItem("token"))
      decodedId  = this.jwt.decodeToken(localStorage.getItem("token")).id;
    this.authToken$ = new BehaviorSubject<string>(localStorage.getItem("token"));
    this.userId$ = new BehaviorSubject<any>(decodedId);
    
  }


  getTokenAuth(email:string, password:string, mode:string):Observable<any> {
      return this.http.post(`${this.ENDPOINT}/${mode}`,{email,password})
      .pipe(
        tap(({success,data}:any) => {
            console.log(data)
            localStorage.setItem("token",data);
            this.authToken$.next(data);
            this.userId$.next(this.jwt.decodeToken(data).id);
        }),
        catchError(
          (err)=> throwError(()=>err)
        )
      );

  }


  logout():Observable<any>{
      localStorage.setItem("token","");
      this.authToken$.next("");
      return this.http.post(`${this.ENDPOINT}/logout`,{})
      .pipe(
        catchError(error=> throwError(()=>error))
      );
  }

/**
 * .subscribe((response:any)=> {
        if(response.success){
          this.authToken$.next(null);
          localStorage.setItem("token",null);
        }
        observer.next(response.success);
        observer.complete();
      });
 */


}
