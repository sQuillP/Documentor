import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';
import { UserService } from 'src/app/services/user.service';
import { forbiddenCharacterValidator } from 'src/app/util/validators';
import { MyErrorStateMatcher } from 'src/app/util/errorStateMatcher';



@Component({
  selector: 'app-newdoc-overlay',
  templateUrl: './newdoc-overlay.component.html',
  styleUrls: ['./newdoc-overlay.component.css']
})
export class NewdocOverlayComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('overlayRef') overlayRef:ElementRef;
  @ViewChild('inputRef') inputRef:ElementRef;
  @Output('closeComponent') closeComponent:EventEmitter<boolean>;

  fetchedEmails$:Observable<any>;

  team:any[] = [];
  roles:any[] = [];

  searchTimeout:any;
  showQueryBar:boolean = false;
  addedMembers:boolean = false;
  showMemberResults:boolean = false;
  isFetchingEmails:boolean = false;
  permissionsList:string[] = ['read','modify','admin'];
  searchValue:string = "";
  documentTitle:string = "";


  docNameFormControl:FormControl;

  matcher:ErrorStateMatcher;
  listener:()=>void;
  
  constructor(
    private renderer:Renderer2,
    private documentService:DocumentService,
    private userService:UserService,
    private router:Router,
    private auth:AuthService,
    ) { 
      this.matcher = new MyErrorStateMatcher();
      this.docNameFormControl = new FormControl('',[
          Validators.required, 
          forbiddenCharacterValidator
      ]);
      this.closeComponent = new EventEmitter<boolean>();
    }


  ngAfterViewInit(): void {
      this.listener = this.renderer.listen(this.overlayRef.nativeElement,'click',(event)=> {
        if(this.inputRef && event.target === this.inputRef.nativeElement)
          this.showMemberResults = true;
        else
          this.showMemberResults = false;
      });
  }

  /**Work on adding team members and allowing modification of roles through UI!!! */
  onAddTeamMember(member:any):void{
    if(this.auth.userId$.getValue() === member._id)
      return;
    for(let i = 0; i<this.team.length; i++)
      if(this.team[i]._id === member._id)
        return;
    
    console.log('not a duplicate member')
    this.team.push(member);
    this.roles.push({
      user: member._id,
      access: "readonly"
    });
    this.searchValue = ''
  }

  onSearchMembers():void{
    this.showQueryBar = true;
    if(!this.searchValue || this.searchTimeout){
      clearTimeout(this.searchTimeout);
      this.isFetchingEmails = false;
    }
    this.isFetchingEmails = true;
    this.searchTimeout = setTimeout(()=> {
      this.fetchedEmails$ = this.userService.searchUsersByEmail(this.searchValue);
      this.isFetchingEmails = false;
      this.showQueryBar = false;
    },500)
  }


  onCreateDocument():void{
    const idArr = this.roles.map(role => role.user);
    this.documentService.createDocument(this.docNameFormControl.value, idArr, this.roles)
    .subscribe({
      next: (docId:string)=> {
          this.router.navigate(["documents",docId])
      },
      error:(error)=> {
        console.log('unable to create document');
      }
    });
  }



  onRemoveUser(index:number):void{
    this.team.splice(index,1);
    this.roles.splice(index,1);
  }

  onCloseComponent():void{
    this.closeComponent.emit(true);
  }

  ngOnDestroy(): void {
      this.listener();
  }

}

