import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-nav-popup',
  templateUrl: './nav-popup.component.html',
  styleUrls: ['./nav-popup.component.css']
})
export class NavPopupComponent implements OnInit {

  constructor(
    public dialogRef:MatDialogRef<NavPopupComponent>
  ) { }

  ngOnInit(): void {
  }

}
