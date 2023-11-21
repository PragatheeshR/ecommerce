import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private baseUrl = "http://localhost:8080/api/products";

  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient : HttpClient) { }

  getProductList(categoryId : number) : Observable<Product[]>{

     const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

     return this.getProducts(searchUrl);
  }

  getProductCategories() : Observable<ProductCategory[]>{

   // const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<GetProductCategoryResponse>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getSearchedProducts(keyword: string | null) : Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponse{
  _embedded: {
      products : Product[]
  }
}

interface GetProductCategoryResponse{
  _embedded: {
      productCategory : ProductCategory[]
  }
}