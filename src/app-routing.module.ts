import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './app/pages/login/login.component';
import { StayIndexComponent } from './app/pages/stay-index/stay-index.component';
import { StayDetailsComponent } from './app/pages/stay-details/stay-details.component';
import { StayResolver } from './app/services/stay-resolver';
import { UserResolver } from './app/services/user-resolver';
import { WishlistIndexComponent } from './app/pages/wishlistIndex/wishlist-Index.component';
import { WishlistDetailsComponent } from './app/pages/wishlist-details/wishlist-details.component';
import { authGuard } from './app/guards/auth-guard';
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
    path: 'wishlist/:userId',
    component: WishlistIndexComponent,
    resolve: { user: UserResolver },
    canActivate: [authGuard],
  },
  {
    path: 'wishlist/:userId/:wishlistId',
    resolve: { user: UserResolver },
    canActivate: [authGuard],

    component: WishlistDetailsComponent,
  },
  {
    path: '',
    redirectTo: 'stay',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
