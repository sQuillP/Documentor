import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth:AuthService, private router: Router) { }

  displayErrorMessage:boolean = false;

  email:string;
  password:string;
  mode:string = 'login';
  isLoading:boolean = false;
  ngOnInit(): void {
    console.log(this.mode)
  }

  onChangeSignInMode(mode:string):void{
    this.mode = mode;
  }

  onSubmit():void{
    this.isLoading = true;
    setTimeout(() => {
      this.auth.getTokenAuth(this.email,this.password, this.mode)
      .subscribe({
        next:(data)=> {
          console.log('in data')
          this.router.navigate(['documents']);
        },
        error: error => {
          console.log(error)
          this.displayErrorMessage = true;
          this.isLoading = false;
        }
      })
    }, 1000);
  }

}
