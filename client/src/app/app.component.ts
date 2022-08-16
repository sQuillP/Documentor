import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  token:string = null;

  constructor(private auth:AuthService){
    this.auth.authToken$.subscribe(token=> {
      this.token = token
    });
    
  }

  title = 'client';
}
