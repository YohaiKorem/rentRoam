import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './app/pages/login/login.component';
import { StayIndexComponent } from './app/pages/stay-index/stay-index.component';
import { StayDetailsComponent } from './app/pages/stay-details/stay-details.component';
import { StayResolver } from './app/services/stay-resolver';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'stay',
    component: StayIndexComponent,
  },
  {
    path: 'stay/:id',
    component: StayDetailsComponent,
    resolve: { stay: StayResolver },
  },
  {
    path: '',
    redirectTo: 'stay', // Redirect to '/stay' if the route is empty
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
