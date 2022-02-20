import {Component, OnInit} from '@angular/core';
import { AuthService} from '../services';

@Component({
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements OnInit {
  unsigned: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.unsigned = !this.authService.getToken();
  }

}
