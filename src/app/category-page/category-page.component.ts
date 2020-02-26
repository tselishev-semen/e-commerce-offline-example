import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Navigation} from '@angular/router';
import {ProductsService} from "../products.service";
import {Product} from "../product";
import {switchMap} from "rxjs/operators";


@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {

  products: Product[] = [];
  categoryName: string;

  constructor(
    private route: ActivatedRoute,
    private categoryService: ProductsService,
  ) {
  }


  ngOnInit(): void {
    this.getProducts();
  }


  getProducts(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.categoryName = params.name;
        return this.categoryService.getProductsByCategory(params.name);
      })
    )
      .subscribe(products => this.products = products);
  }
}
