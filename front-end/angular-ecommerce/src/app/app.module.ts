import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';

import {HttpClientModule} from '@angular/common/http'
import { ProductService } from './services/product.service';
import { Route, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';

const routes : Route[] =[
  {path: 'category/:id', component: ProductListComponent}, //Here the user clicks on the link where if the path as category/id then it creates instance of ProductListComponent
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'category/:id', redirectTo:'/products', pathMatch:'full'},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: '**', redirectTo:'/products', pathMatch:'full'},
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }