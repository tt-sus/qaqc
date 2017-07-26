import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { LoginRouteGuard } from './auth/login-route-guard';
export const appRoutes: Routes = [
  { path: "", component: AuthComponent,pathMatch:"full"},
  { path: "home", component: HomeComponent},
  {path:"projectDetail/:id/:manager",component:ProjectdetailsComponent},
  { path: '**', component: AuthComponent}
//   { path: 'hero/:id',      component: HeroDetailComponent },
//   {
//     path: 'heroes',
//     component: HeroListComponent,
//     data: { title: 'Heroes List' }
//   },
//   { path: '',
//     redirectTo: '/heroes',
//     pathMatch: 'full'
//   },
//   { path: '**', component: PageNotFoundComponent } canActivate: [LoginRouteGuard]
];