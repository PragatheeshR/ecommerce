import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public product!: Product;
  public productId : number = 0;

  constructor(private productService : ProductService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.productDetailInfo();
    });
  }

  productDetailInfo(){
        this.productId = + this.route.snapshot.paramMap.get("id")!;
        this.productService.getProduct(this.productId).subscribe(
          data => {
            this.product = data;
          }
        );
  }



}
