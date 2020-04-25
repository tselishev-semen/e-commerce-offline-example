import {Component, OnInit} from '@angular/core';
import {Product} from '../product';
import {ActivatedRoute} from '@angular/router';
import {ProductsService} from '../products.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  product: Product;

  constructor(
    private route: ActivatedRoute,
    private categoryService: ProductsService,
  ) {
  }


  ngOnInit(): void {
    this.getProduct();
  }


  getProduct(): void {
    const productId = +this.route.snapshot.paramMap.get('id');
    this.categoryService.getProductById(productId)
      .subscribe(product => this.product = product);
  }

}
