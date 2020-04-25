import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {OnlineConnectorService} from './online-connector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  online: boolean;

  constructor(private location: Location, private onlineServiceConnector: OnlineConnectorService) {
  }
  ngOnInit(): void {
    this.onlineServiceConnector.online$.subscribe((value) => {
      this.online = value;
    });
  }
  goBack(): void {
    this.location.back();
  }
}
