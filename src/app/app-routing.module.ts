import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CategoryPageComponent } from './category-page/category-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {path: 'category/:name', component: CategoryPageComponent},
  {path: '', component: HomePageComponent, pathMatch: 'full'},
  { path: 'product/:id', component: ProductPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
