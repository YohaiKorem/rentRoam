import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app-root/app.component';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from './app/cmps/app-header/app-header.component';
import { StayIndexComponent } from './app/pages/stay-index/stay-index.component';
import { StayDetailsComponent } from './app/pages/stay-details/stay-details.component';
import { LoginComponent } from './app/pages/login/login.component';
import { StayListComponent } from './app/cmps/stay-list/stay-list.component';
import { StayPreviewComponent } from './app/cmps/stay-preview/stay-preview.component';
import { FilterModalComponent } from './app/cmps/filter-modal/filter-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
