import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  categoryId : number = 1;
  searchMode: boolean = false;

  constructor(private productService : ProductService, private route : ActivatedRoute) { }

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


  handleSearchProducts() {

     const keyword = this.route.snapshot.paramMap.get("keyword");

     this.productService.getSearchedProducts(keyword).subscribe(
      data => {
        this.products = data;
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

    //now get the products for given category id

      this.productService.getProductList(this.categoryId).subscribe(
          data => {
            this.products = data;
          }
      );

  }

}
