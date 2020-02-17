import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {FormsModule} from '@angular/forms'; // <-- NgModel lives here

import {AppComponent} from './app.component';
import {HeroesComponent} from './heroes/heroes.component';
import {HeroDetailsComponent} from './hero-details/hero-details.component';
import {MessagesComponent} from './messages/messages.component';
import {AppRoutingModule} from './app-routing.module';
import {OnlineConnectorService} from './online-connector.service';
import {DashboardComponent} from './dashboard/dashboard.component';
// import {HeroBirthdayComponent} from './hero-birthday.component';
import {HttpClientModule} from '@angular/common/http';
import { OnlineBannerComponent } from './online-banner/online-banner.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailsComponent,
    MessagesComponent,
    DashboardComponent,
    OnlineBannerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('service-worker.js')
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
