import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* Components */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { NewdocOverlayComponent } from './documents/newdoc-overlay/newdoc-overlay.component';

/* ng-quill module */
import { QuillModule } from 'ngx-quill'
import { modules } from './util/quill.config';


/* Material UI modules */
import {MatRippleModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NavigationComponent } from './navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import { DocumentsComponent } from './documents/documents.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import { ViewdocumentComponent } from './documents/viewdocument/viewdocument.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { RenamePopupComponent } from './documents/rename-popup/rename-popup.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DeletePopupComponent } from './documents/delete-popup/delete-popup.component';
import { NavPopupComponent } from './navigation/nav-popup/nav-popup.component';
import {MatChipsModule} from '@angular/material/chips';
import { EditMembersComponent } from './documents/edit-members/edit-members.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavigationComponent,
    DocumentsComponent,
    NewdocOverlayComponent,
    ViewdocumentComponent,
    RenamePopupComponent,
    DeletePopupComponent,
    NavPopupComponent,
    EditMembersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    /**Last left off here */
    QuillModule.forRoot({
      modules
    }),

    /* Material UI imports */
    MatRippleModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatChipsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
