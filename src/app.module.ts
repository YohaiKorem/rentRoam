import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
