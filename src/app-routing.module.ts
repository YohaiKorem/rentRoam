import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StayIndexComponent } from './app/pages/stay-index/stay-index.component';
import { StayDetailsComponent } from './app/pages/stay-details/stay-details.component';
import { StayResolver } from './app/services/stay-resolver';
import { UserResolver } from './app/services/user-resolver';
import { WishlistIndexComponent } from './app/pages/wishlistIndex/wishlist-Index.component';
import { WishlistDetailsComponent } from './app/pages/wishlist-details/wishlist-details.component';
import { authGuard } from './app/guards/auth-guard';
import { StayEditComponent } from './app/pages/stay-edit/stay-edit.component';
import { HostGuard } from './app/guards/host-guard';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { TripIndexComponent } from './app/pages/trip-index/trip-index.component';
import { BookComponent } from './app/pages/book/book.component';
import { OrderResolver } from './app/services/order.resolver';
import { MessageIndexComponent } from './app/pages/message-index/message-index.component';
import { SignupModalComponent } from './app/cmps/signup-modal/signup-modal.component';
import { ChatIndexComponent } from './app/pages/chat-index/chat-index.component';
import { staysGuard } from './app/guards/stays.guard';
const routes: Routes = [
  { path: 'login', component: SignupModalComponent },
  {
    path: 'stay',
    component: StayIndexComponent,
  },
  {
    path: 'stay/edit/:stayId',
    component: StayEditComponent,
    canActivate: [authGuard, HostGuard],
  },
  {
    path: 'stay/edit',
    component: StayEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'stay/:id',
    component: StayDetailsComponent,
    resolve: { stay: StayResolver },
  },
  {
    path: 'book/:orderId',
    component: BookComponent,
    canActivate: [authGuard],

    resolve: { order: OrderResolver },
  },
  {
    path: 'inbox/:userId',
    component: MessageIndexComponent,
    canActivate: [authGuard],
    resolve: { user: UserResolver },
  },
  {
    path: 'messages/:userId/:orderId',
    component: ChatIndexComponent,
    canActivate: [authGuard],
    resolve: { user: UserResolver, order: OrderResolver },
  },
  {
    path: 'host/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, staysGuard],
  },
  {
    path: 'trip',
    component: TripIndexComponent,
    canActivate: [authGuard],
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
