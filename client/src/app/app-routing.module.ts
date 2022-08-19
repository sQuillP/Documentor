import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { DocumentsComponent } from './documents/documents.component';
const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "documents", component: DocumentsComponent},
  {path: "home", component: HomeComponent, canActivate: [AuthGuard]},
  {path: "", redirectTo:"/login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
