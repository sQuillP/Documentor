import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-newdoc-overlay',
  templateUrl: './newdoc-overlay.component.html',
  styleUrls: ['./newdoc-overlay.component.css']
})
export class NewdocOverlayComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('overlayRef') overlayRef:ElementRef;
  @ViewChild('inputRef') inputRef:ElementRef;

  addedMembers:boolean = false;
  showMemberResults:boolean = false;
  permissionsList:string[] = ['read','modify','admin'];
  searchValue:string = "";
  documentTitle:string = "";


  listener:()=>void;
  
  constructor(
    private renderer:Renderer2,
    private documentService:DocumentService
    ) { }


  ngAfterViewInit(): void {
      this.listener = this.renderer.listen(this.overlayRef.nativeElement,'click',(event)=> {
        if(this.inputRef && event.target === this.inputRef.nativeElement)
          this.showMemberResults = true;
        else
          this.showMemberResults = false;
      });
  }

  onAddTeamMember():void{
    console.log('clicked')
  }

  onSearchMembers():void{
    console.log("should be searching members")
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      this.listener();
  }

}
