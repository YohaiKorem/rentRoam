import { NgModule } from '@angular/core';
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
import { ClickOutsideDirective } from './app/directives/click-outside';

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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
