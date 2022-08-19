import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-newdoc-overlay',
  templateUrl: './newdoc-overlay.component.html',
  styleUrls: ['./newdoc-overlay.component.css']
})
export class NewdocOverlayComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('overlayRef') overlayRef:ElementRef;
  @ViewChild('inputRef') inputRef:ElementRef;


  fetchedEmails$:Observable<any>;

  team:string[] = [];
  roles:any[] = [];

  searchTimeout:any;
  addedMembers:boolean = false;
  showMemberResults:boolean = false;
  isFetchingEmails:boolean = false;
  permissionsList:string[] = ['read','modify','admin'];
  searchValue:string = "";
  documentTitle:string = "";
  

  /**
   * team: ["id1", "id2", ..., "id12"]
   * roles:[
   * {
   *   user: userid,
   *   access: "admin" 
   * }
   * ]
   * 
   */


  listener:()=>void;
  
  constructor(
    private renderer:Renderer2,
    private documentService:DocumentService,
    private userService:UserService,
    ) { }


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
    this.team.push(member._id);
    this.roles.push({user:member._id, access: "readonly"});
  }

  onSearchMembers():void{
    // display query loading screen.
    if(!this.searchValue || this.searchTimeout){
      clearTimeout(this.searchTimeout);
      this.isFetchingEmails = false;
    }
    this.isFetchingEmails = true;
    this.searchTimeout = setTimeout(()=> {
      console.log('fetching data');
      this.fetchedEmails$ = this.userService.searchUsersByEmail(this.searchValue);
      this.isFetchingEmails = false;
      // remove query screen
    },500)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      this.listener();
  }

}
