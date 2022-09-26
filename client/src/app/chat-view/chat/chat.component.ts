import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, catchError, delay, map, mergeMap, Observable, tap, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('chatRef')chatRef:ElementRef;

  chat$ = new BehaviorSubject<any>(null);
  user$ = new BehaviorSubject<any>(null);
  documentId$ = new BehaviorSubject<any>(null);
  message:string;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private documentService:DocumentService,
    private socket:Socket,
    private snackbar:MatSnackBar,
    private auth:AuthService
  ) { 

    this.route.params.pipe(
      mergeMap((params:any) => this.documentService.getDocumentById(params.chatRoom,{populateMessages:"true"})),
      mergeMap((data)=> {
        this.documentId$.next(data._id);
        this.chat$.next(data.chat);
        return this.auth.getMe();
      }),
      catchError(error => {
        this.snackbar.open("Unable to open chat / Invalid ID","OK",{
          duration: 3000
        });
        this.router.navigate(["documents"]);
        return throwError(()=> error);
      })
    )
    .subscribe({
      next: (user:any)=> {
        this.user$.next(user);
      
      },
      error: (error)=> {
        console.log('unable to retrieve params');
        this.router.navigate(["documents"]);
      }
    });
    this.receiveMessage();
  }

  ngOnInit(): void {
    
  }


  ngAfterViewInit(): void {

  }

  receiveMessage():void{
    this.socket.on('receive-message',(message)=> {
      console.log(message);
      this.chat$.next([...this.chat$.getValue(),message]);
    });
  }

  onSendMessage():void{
    const message = {
      author: this.auth.userId$.getValue(),
      name: this.user$.getValue().name,
      image: null,
      content: this.message,
      seenBy: [],
      createdAt: Date.now()
    };
    if(this.documentId$.getValue() !== null){
      console.log('sending message');
      this.socket.emit('send-message',this.documentId$.getValue(),message);
      this.message = "";
    }
    this.chatRef.nativeElement.scrollTop = this.chatRef.nativeElement.scrollHeight;
  }


  onNavigate(route:string):void{
    this.router.navigate([route]);
  }

}
