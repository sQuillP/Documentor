import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn:"root"})
export class PermissionsService {

    private readonly ENDPOINT:string = "http://localhost:5000/api/v1";



    constructor(
        private http:HttpClient
    ){}

    /* Fetch the permissions for a particular document. */
    getDocumentPermissions(documentid:string):Observable<any> {
        return this.http.get(`${this.ENDPOINT}/documents/${documentid}/permissions`)

        
    }
}