import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { PagerService } from 'pagination';
import { HomeComponent } from './home/home.component';
import {appRoutes} from './app.routes';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth.service';
import { ProjectFilterPipe } from './shared/project-filter.pipe';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    ProjectFilterPipe,
    ProjectdetailsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    RouterModule,
    FormsModule,
      RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [ PagerService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
