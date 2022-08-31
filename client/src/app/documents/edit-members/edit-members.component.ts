import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, debounceTime, map, Observable, retryWhen, startWith, Subscription, switchMap, tap } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.css']
})
export class EditMembersComponent implements AfterViewInit {

  myFormControl:FormControl = new FormControl("");
  searchResults$:Observable<any>;
  searchResults:any;
  toggleLoader:boolean = false;
  documentMembers:any = [];
  permissionsConfig:{ //Object to send updates to the API with new permissions.
    team: string[],
    roles: {
      user:string,
      access: string
    }[]
  } = {team: [], roles: []};

  constructor(
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) public dialogData:any
  ) { 
    console.log(this.dialogData.document);
    this.documentMembers = [...this.dialogData.document.team];
    this.permissionsConfig.team = this.dialogData.document.team.map(member=> member._id);
    this.dialogData.document.permissions.forEach((permission:any) => {
      this.permissionsConfig.roles.push({
        user: permission.user, 
        access: permission.access
      });
    });
    console.log(this.permissionsConfig)
  }


  /* Add error when there are no users to search.
     add all / current users to the current permissions list when finding current users. 
  */
  ngAfterViewInit(): void {
    this.searchResults$ = this.myFormControl.valueChanges.pipe(
      tap(data => this.toggleLoader = true),
      debounceTime(500),
      switchMap(email =>  this.userService.searchUsersByEmail(email,6)),
      tap(data => this.toggleLoader = false),
    );
  }


  onHandleChange(event:KeyboardEvent){
    if(event.key !== "Enter") return;
    this.userService.searchUsersByEmail(this.myFormControl.value,1)
    .subscribe({
      next: (data:any)=> {
        if(!data.length){
          console.log("user does not exist");
          this.myFormControl.setErrors({userNotFound:true});
          return;
        }
        const foundUser = data[0];
        for(let member of this.documentMembers){ //Make sure there are no duplicates
          if(foundUser._id === member._id){
            this.myFormControl.setErrors({userAlreadyAdded:true});
            return;
          }
        }
        this.permissionsConfig.team.push(foundUser._id);
        this.permissionsConfig.roles.push({user:foundUser._id, access: "readonly"});
        this.documentMembers.push(foundUser); //add to iterable html list
        this.myFormControl.setValue(""); //clear form
      },
      error:(error) => {
        console.log(error)
      }
    });
  }



  onDebug():void{
    console.log(this.permissionsConfig);
  }
  onRemoveMember(index:number):void{
    this.permissionsConfig.team.splice(index,1);
    this.permissionsConfig.roles.splice(index,1);
    this.documentMembers.splice(index,1);
  }

}
