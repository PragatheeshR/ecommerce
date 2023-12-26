import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';
import { Pagination } from '../common/pagination';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  private endpoint = environment.baseBackEndUrl;

  private baseUrl =  this.endpoint + "/products";

  private categoryUrl = this.endpoint + "/product-category";

  constructor(private httpClient : HttpClient) { }

  getProductList(categoryId : number) : Observable<Product[]>{

     const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

     return this.getProducts(searchUrl);
  }

  getProductListPagination( categoryId : number, thePage : number, thePageSize : number) : Observable<GetProductResponse>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl);

    
    return this.httpClient.get<GetProductResponse>(searchUrl);
 }

  getProductCategories() : Observable<ProductCategory[]>{

   // const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<GetProductCategoryResponse>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getSearchedProducts(keyword: string | null, thePageNumber : number, thePageSize : number) : Observable<GetProductResponse> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${thePageNumber}&size=${thePageSize}`;

    return this.httpClient.get<GetProductResponse>(searchUrl);
  }

  

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetProductResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(productId : number): Observable<Product>  {
    const searchUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }
}

interface GetProductResponse{
  _embedded: {
      products : Product[]
  },
  page : Pagination
}

interface GetProductCategoryResponse{
  _embedded: {
      productCategory : ProductCategory[]
  }
}
