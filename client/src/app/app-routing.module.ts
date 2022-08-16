import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "home", component: HomeComponent, canActivate: [AuthGuard]},
  {path: "", redirectTo:"/login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
