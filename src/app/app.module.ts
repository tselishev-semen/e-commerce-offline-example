import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {FormsModule} from '@angular/forms'; // <-- NgModel lives here

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
// import {OnlineConnectorService} from './online-connector.service';
import {HttpClientModule} from '@angular/common/http';
import { OnlineBannerComponent } from './online-banner/online-banner.component';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';
import { CategoryPageComponent } from './category-page/category-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { HomePageComponent } from './home-page/home-page.component';


@NgModule({
  declarations: [
    AppComponent,
    OnlineBannerComponent,
    CategoryPageComponent,
    ProductPageComponent,
    HomePageComponent,
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
