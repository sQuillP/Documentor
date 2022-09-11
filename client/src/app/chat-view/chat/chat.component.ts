import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  
  document$:Observable<any>;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private documentService:DocumentService
  ) { 
    this.route.params.subscribe((params:any)=> {
      this.document$ = this.documentService.getDocumentById(params.chatRoom,{populateMessages:"true"})
    });

    this.document$.subscribe(data => console.log(data))
  }

  ngOnInit(): void {
    
  }


  onNavigate(route:string):void{
    this.router.navigate([route]);
  }

}
