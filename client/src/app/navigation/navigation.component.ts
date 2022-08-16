import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(
    private router: Router, 
    private auth: AuthService,
    private snackbar:MatSnackBar
    ) { }


  ngOnInit(): void {
  }

  onNavigate(route:string):void{
    this.router.navigate([route]);
  }

  onLogout():void{
    this.auth.logout().subscribe({
      next: (success:boolean)=> {
        this.displayMessage("You have successfully signed out","Cool");    
        this.router.navigate(["login"]);
      },
      error: (error)=> {
        console.log(error,"error!")
        this.displayMessage("Internal error, unable to sign you out","OK");
      }
    })
  }

  displayMessage(message:string,action:string):void{
    this.snackbar.open(message,action,{
      duration: 5000
    });
  }

}
