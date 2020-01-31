import {Component, OnInit} from '@angular/core';
import {OnlineConnectorService} from '../online-connector.service';

@Component({
  selector: 'app-online-banner',
  templateUrl: './online-banner.component.html',
  styleUrls: ['./online-banner.component.scss']
})
export class OnlineBannerComponent implements OnInit {
  online: boolean;

  constructor(private onlineServiceConnector: OnlineConnectorService) {
  }

  ngOnInit(): void {
    this.onlineServiceConnector.online$.subscribe((value) => {
      this.online = value;
    });
  }
}
