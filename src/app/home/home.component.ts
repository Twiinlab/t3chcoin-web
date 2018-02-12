import { Component, OnInit } from '@angular/core';
import { T3chcoinService } from '../core/t3chcoin/t3chcoin.service';

const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  messages: any;

  constructor(public t3chcoinService: T3chcoinService) { }

  ngOnInit() {

    this.t3chcoinService
    .getTopSocials()
    .subscribe(socials => {
      this.messages = socials.map(item => {
        return {
          photoUrl: PROFILE_PLACEHOLDER_IMAGE_URL,
          socialId: '#UserName',
          totalAll: item.totalAll,
          totalTwit: item.totalTwit,
          totalTwitLike: item.totalTwit,
          totalTwitRetweet: item.totalTwitRetweet
        }
      })
    });

  }
}
