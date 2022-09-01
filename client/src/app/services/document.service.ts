import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable,map,tap, catchError, throwError } from "rxjs";


@Injectable({providedIn:"root"})
export class DocumentService {

    private ENDPOINT = "http://localhost:5000/api/v1/documents"
    

    constructor(private http: HttpClient){

    }


    /* Get documents created by user */
    getMyDocuments():Observable<any> {
        console.log('calling getmydocuments')
        return this.http.get(`${this.ENDPOINT}`)
        .pipe(
            map((response:any) => response.data),
            tap(data=> console.log(data)),
            catchError(error => throwError(()=> error))
        );
    }


    /* Get documents that are shared with the user */
    getSharedDocuments():Observable<any> {
        return this.http.get(`${this.ENDPOINT}`,{
            params:{
                findTeam:"true"
            }
        })
        .pipe(
            map((response:any) => response.data),
            catchError(error => throwError(()=>error))
        );
    }


    getDocumentById(id:string):Observable<any> {
        return this.http.get(`${this.ENDPOINT}/${id}`)
        .pipe(
            map((response:any) => response.data),
            catchError(error => throwError(()=>error))
        );
    }


    /* Create a new document */
    createDocument(title:string, idArr:string[],roles:{user:string, access:string}[]): Observable<any>{
        return this.http.post(`${this.ENDPOINT}`,{title, content: null, team: idArr, roles})
        .pipe(
            map(
                (response:any) => {return response.data._id;}
            ),
            catchError(error => throwError(()=>error))
        );
    }



    saveDocument(documentId:string, update:any):Observable<any> {
        return this.http.put(`${this.ENDPOINT}/${documentId}`,update)
        .pipe(
            map((response:any)=> response.data),
            catchError(error => throwError(()=>error))
        );
    }


    /* Remove a document that a user owns. */
    deleteDocument(documentId:string):Observable<any> {
        return this.http.delete(`${this.ENDPOINT}/${documentId}`)
        .pipe(
            map(
                (response:any)=> response.success
            ),
            catchError(error => throwError(()=> error))
        );
    }
    
}