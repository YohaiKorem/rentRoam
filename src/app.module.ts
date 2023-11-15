import { NgModule, isDevMode } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AppComponent } from './app/app-root/app.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppHeaderComponent } from './app/cmps/app-header/app-header.component';
import { StayIndexComponent } from './app/pages/stay-index/stay-index.component';
import { StayDetailsComponent } from './app/pages/stay-details/stay-details.component';
import { LoginComponent } from './app/pages/login/login.component';
import { StayListComponent } from './app/cmps/stay-list/stay-list.component';
import { StayPreviewComponent } from './app/cmps/stay-preview/stay-preview.component';
import { FilterModalComponent } from './app/cmps/filter-modal/filter-modal.component';
import { RadioFilterComponent } from './app/cmps/radio-filter/radio-filter.component';
import { DynamicModalComponent } from './app/cmps/dynamic-modal/dynamic-modal.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChartComponent } from './app/cmps/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ClickOutsideDirective } from './app/directives/click-outside';
import { GoogleMapCmpComponent } from './app/cmps/google-map/google-map.component';
import { ReviewPreviewComponent } from './app/cmps/review-preview/review-preview.component';
import { AmenityListComponent } from './app/cmps/amenity-list/amenity-list.component';
import { ReviewListComponent } from './app/cmps/review-list/review-list.component';
import { MobileSearchMenuComponent } from './app/cmps/mobile-search-menu/mobile-search-menu.component';
import { InlineRangeCalendarComponent } from './app/cmps/inline-range-calendar/inline-range-calendar.component';
import { SwipeDirectiveDirective } from './app/directives/swipe-directive.directive';
import { SignupModalComponent } from './app/cmps/signup-modal/signup-modal.component';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { CloudinaryModule } from '@cloudinary/ng';
import { WishlistIndexComponent } from './app/pages/wishlistIndex/wishlist-Index.component';
import { WishlistPreviewComponent } from './app/cmps/wishlist-preview/wishlist-preview.component';
import { WishlistEditComponent } from './app/cmps/wishlist-edit/wishlist-edit.component';
import { WishlistListComponent } from './app/cmps/wishlist-list/wishlist-list.component';
import { StayPreviewLoaderComponent } from './app/cmps/stay-preview-loader/stay-preview-loader.component';
import { WishlistDetailsComponent } from './app/pages/wishlist-details/wishlist-details.component';
import { ImgErrorDirective } from './app/directives/img-error.directive';
import { StayEditComponent } from './app/pages/stay-edit/stay-edit.component';
import { GooglePlacesAutocompleteDirective } from './app/directives/google-places-autocomplete.directive';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { OrderListComponent } from './app/cmps/order-list/order-list.component';
import { OrderPreviewComponent } from './app/cmps/order-preview/order-preview.component';
import { PreventDefaultDirective } from './app/directives/prevent-default.directive';
import { StopPropagationDirective } from './app/directives/stop-propagation.directive';
import { TripIndexComponent } from './app/pages/trip-index/trip-index.component';
import { TripListComponent } from './app/cmps/trip-list/trip-list.component';
import { TripPreviewComponent } from './app/cmps/trip-preview/trip-preview.component';
import { TripDetailsComponent } from './app/cmps/trip-details/trip-details.component';
import { BookComponent } from './app/pages/book/book.component';
import { MessageIndexComponent } from './app/pages/message-index/message-index.component';
import { ChatListComponent } from './app/cmps/chat-list/chat-list.component';
import { ChatPreviewComponent } from './app/cmps/chat-preview/chat-preview.component';
import { ChatEditComponent } from './app/cmps/chat-edit/chat-edit.component';
import { MsgListComponent } from './app/cmps/msg-list/msg-list.component';
import { MsgPreviewComponent } from './app/cmps/msg-preview/msg-preview.component';
import { LabelLoaderComponent } from './app/cmps/label-loader/label-loader.component';
import { MobileFooterComponent } from './app/pages/mobile-footer/mobile-footer.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ChatIndexComponent } from './app/pages/chat-index/chat-index.component';
import { ShareMenuComponent } from './app/cmps/share-menu/share-menu.component';
@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    StayIndexComponent,
    LoginComponent,
    StayDetailsComponent,
    StayListComponent,
    StayPreviewComponent,
    FilterModalComponent,
    RadioFilterComponent,
    DynamicModalComponent,
    ChartComponent,
    ClickOutsideDirective,
    GoogleMapCmpComponent,
    ReviewPreviewComponent,
    AmenityListComponent,
    ReviewListComponent,
    MobileSearchMenuComponent,
    InlineRangeCalendarComponent,
    SwipeDirectiveDirective,
    SignupModalComponent,
    WishlistIndexComponent,
    WishlistPreviewComponent,
    WishlistEditComponent,
    WishlistListComponent,
    StayPreviewLoaderComponent,
    WishlistDetailsComponent,
    ImgErrorDirective,
    StayEditComponent,
    GooglePlacesAutocompleteDirective,
    DashboardComponent,
    OrderListComponent,
    OrderPreviewComponent,
    PreventDefaultDirective,
    StopPropagationDirective,
    TripIndexComponent,
    TripListComponent,
    TripPreviewComponent,
    TripDetailsComponent,
    BookComponent,
    MessageIndexComponent,
    ChatListComponent,
    ChatPreviewComponent,
    ChatEditComponent,
    MsgListComponent,
    MsgPreviewComponent,
    LabelLoaderComponent,
    MobileFooterComponent,
    ChatIndexComponent,
    ShareMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    MatSliderModule,
    NgChartsModule,
    MatSlideToggleModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    GoogleMapsModule,
    MatCardModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    CloudinaryModule,
    ShareButtonsModule.withConfig({
      debug: true,
    }),
    ShareIconsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '346749624393-mah9uga9dklfedeg946m1dlkknji4v6e.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('644003741032425'),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
