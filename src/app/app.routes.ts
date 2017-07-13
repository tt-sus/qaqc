import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
export const appRoutes: Routes = [
  { path: "", component: AuthComponent },
  { path: "home", component: HomeComponent },
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
//   { path: '**', component: PageNotFoundComponent }
];