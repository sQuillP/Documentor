import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  token:string = null;

  constructor(private auth:AuthService, private socket:Socket){
    this.auth.authToken$.subscribe(token=> {
      this.token = token
    });
    this.socket.emit('connect-user',this.auth.userId$.getValue());
  }
  title = 'client';
}
 