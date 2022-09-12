import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';
import { DocumentService } from '../services/document.service';


@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent implements OnInit {

  fetchedDocuments$:Observable<any>;
  myFetchedDocuments$:Observable<any>;

  constructor(
    private documentService:DocumentService,
    private router:Router
  ) { 
    console.log('should be fetching document data')

    this.fetchedDocuments$ = this.documentService.getSharedDocuments()
    .pipe(
      map(data => !data.length?null:data)
    );

    this.myFetchedDocuments$ = this.documentService.getMyDocuments().pipe(
      map(data =>{ 
        let filteredData = data.filter((el:any) => el.team.length >0);
        if(!filteredData.length) return null;
        return filteredData;
      })
    );

    this.fetchedDocuments$.subscribe(data =>console.log(data));
  }

  ngOnInit(): void {
  }

  onNavigate(documentID:string):void{
    this.router.navigate(["chat",documentID]);
  }

}
