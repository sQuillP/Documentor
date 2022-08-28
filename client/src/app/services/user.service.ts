import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";


@Injectable({providedIn:"root"})
export class UserService {

    private ROUTE:string = "http://localhost:5000/api/v1/users";

    constructor(private http:HttpClient){

    }


    searchUsersByEmail(expression:string, limit?:number):Observable<any>{
        return this.http.get(`${this.ROUTE}`,{
            params:{
                email: expression,
                limit
            }
        })
        .pipe(
            map((response:any) => {
                return response.data;
            }),
            tap(
                data=> console.log(data)
            )
        );
    }
}