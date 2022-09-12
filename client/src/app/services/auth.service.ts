import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ENDPOINT = "http://localhost:5000/api/v1/auth";
  private jwt:JwtHelperService;

  authToken$:BehaviorSubject<string>;
  userId$:BehaviorSubject<any>;
  user$ = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private socket:Socket
    ) 
    {
      this.jwt = new JwtHelperService();
      let decodedId = null;
      // if(localStorage.getItem("token"))
      //   decodedId  = this.jwt.decodeToken(localStorage.getItem("token")).id;
      this.authToken$ = new BehaviorSubject<string>(null/*localStorage.getItem("token")*/);
      this.userId$ = new BehaviorSubject<any>(decodedId);
  }


  getTokenAuth(email:string, password:string, mode:string):Observable<any> {
      return this.http.post(`${this.ENDPOINT}/${mode}`,{email,password})
      .pipe(
        tap(({success,data}:any) => {
            console.log(data)
            // localStorage.setItem("token",data);
            this.authToken$.next(data);
            this.userId$.next(this.jwt.decodeToken(data).id);
            this.socket.emit('connect-user',this.userId$.getValue());
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

  getMe():Observable<any>{
    return this.http.get(`${this.ENDPOINT}/getme`).pipe(map((response:any) => response.data));
  }

}
