import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DocumentsComponent } from './documents/documents.component';
import { ViewdocumentComponent } from './documents/viewdocument/viewdocument.component';
import { ChatComponent } from './chat-view/chat/chat.component';
import { ChatViewComponent } from './chat-view/chat-view.component';
const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "documents", component: DocumentsComponent, canActivate: [AuthGuard]},
  {path: "chat/:chatRoom", component: ChatComponent, canActivate: [AuthGuard]},
  {path: "documents/:documentId", component: ViewdocumentComponent},
  {path: "chat", component: ChatViewComponent, canActivate: [AuthGuard]},
  {path: "", redirectTo:"/login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
