import {Component} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'E-Commerce Offline Example';

  constructor(private location: Location) {
  }

  goBack(): void {
    this.location.back();
  }
}
