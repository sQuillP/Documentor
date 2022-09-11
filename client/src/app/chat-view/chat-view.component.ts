import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { DocumentService } from '../services/document.service';


@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent implements OnInit {

  fetchedDocuments$:Observable<any>;

  constructor(
    private documentService:DocumentService,
    private router:Router
  ) { 
    console.log('should be fetching document data')
    this.fetchedDocuments$ = this.documentService.getSharedDocuments().pipe(
      tap(
        data=> {console.log(data)}
      )
    );

  }

  ngOnInit(): void {
  }

  onNavigate(documentID:string):void{
    this.router.navigate(["chat",documentID]);
  }

}
