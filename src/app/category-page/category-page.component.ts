import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from "../category.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private location: Location
  ) {
  }


  ngOnInit(): void {
    this.getProducts();
  }

  goBack(): void {
    this.location.back();
  }

  getProducts(): void {
    const categoryName = this.route.snapshot.paramMap.get('name');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }
}
