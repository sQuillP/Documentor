import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.css']
})
export class EditMembersComponent implements OnInit {

  emailSearch:string = "";
  searchResults$:Observable<any>;
  toggleLoader:boolean = false;

  searchResults:any;
  timeout:any;

  team:any;
  roles:any

  // Fix search results and adding members to the add members options.

  constructor(
    private userService:UserService,
    private documentService:DocumentService,
    @Inject(MAT_DIALOG_DATA) public document:any
  ) { 
    this.team = this.document.team;
    this.searchResults$.subscribe(results => {
      this.searchResults = results;
    });
  }

  ngOnInit(): void {
    // this.documentService.getDocumentById()
  }

  onHandleChange(event:KeyboardEvent){

    if(event.key === "Enter"){
      // add member to the current list of team

      this.emailSearch = "";
      return;
    }

    console.log(event);
    console.log(this.document);
    if(!this.emailSearch || this.timeout){
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.toggleLoader = true;
    this.timeout = setTimeout(()=> {
      this.searchResults$ = this.userService.searchUsersByEmail(this.emailSearch,6);
      this.toggleLoader = false;
    },500);


  }

  onRemoveMember(member:any):void{
    
  }

}
