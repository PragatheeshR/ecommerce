import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  categoryId : number = 1;
  previousCategoryId : number = 1;
  searchMode: boolean = false;

  //for pagination

  thePageNumber : number = 1;
  thePageSize : number = 10
  theTotalElements : number = 0;


  constructor(private productService : ProductService, private route : ActivatedRoute, private cartService : CartService) { }

  // acts like a PostConstruct Method
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if(this.searchMode){
      this.handleSearchProducts();
    }
  
    else{
    this.handelListProducts();
    }
  }

  updatePageSize(pageSize : string){
      this.thePageNumber = 1;
      this.thePageSize = +pageSize;
      this.listProducts();
  }


  handleSearchProducts() {

     const keyword = this.route.snapshot.paramMap.get("keyword");

     this.productService.getSearchedProducts(keyword,this.thePageNumber - 1, this.thePageSize).subscribe(
      data => {
          console.log("Products value"+ JSON.stringify(data));
            this.products = data._embedded.products;
            console.log("Products value"+ JSON.stringify(data._embedded.products));
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
      }
     );
  }

  handelListProducts(){

    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id'); 

    if(hasCategoryId){
       this.categoryId = +this.route.snapshot.paramMap.get('id')!; // ! symbol is to say that the value will not be null
    }
    else{
      this.categoryId = 1;
    }

    //if we have diff category compared to previous one, then set pageNumber = 1 as we need to show products for that category from start

    if(this.previousCategoryId != this.categoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.categoryId;
    console.log(this.categoryId, this.previousCategoryId);


    //now get the products for given category id

      this.productService.getProductListPagination(this.categoryId, this.thePageNumber - 1, this.thePageSize).subscribe(
          data => {
            console.log("Categories value"+ JSON.stringify(data));
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
          }
      );

  }

  addToCart(product : Product){
      console.log(`${product.name} price : ${product.unitPrice}`);
      let cartItem : CartItem = new CartItem(product);

      this.cartService.addToCart(cartItem);
      console.log("Added to Cart Successfully in Product LIST component");

      
  }

}
