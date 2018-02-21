import { Component, OnInit } from '@angular/core';
import { T3chcoinService } from '../core/t3chcoin/t3chcoin.service';

const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  socialMessages: any;
  tableSocialColumns = ['photoUrl', 'socialId', 'totalAll', 'totalTwit', 'totalTwitRetweet', 'totalTwitLike'];

  userMessages: any;
  tableUserColumns = ['avatar', 'selectedItem', 'userName', 'itemsCount', 'balance'];

  constructor(public t3chcoinService: T3chcoinService) { }

  ngOnInit() {
    this.initSocialMessage();
    this.initUserMessage()
  }

  initSocialMessage() {
    this.t3chcoinService
    .getTopSocials()
    .subscribe(socials => {
      this.socialMessages = socials.map(item => {
        return {
          photoUrl: PROFILE_PLACEHOLDER_IMAGE_URL,
          socialId: item.socialId || '#UserName',
          totalAll: item.totalAll,
          totalTwit: item.totalTwit,
          totalTwitLike: item.totalTwit,
          totalTwitRetweet: item.totalTwitRetweet
        }
      });
    });
  }

  initUserMessage() {
    this.t3chcoinService
    .getUserTopList()
    .subscribe(user => {
      this.userMessages  = user.map(item => {
        return {
          avatar: PROFILE_PLACEHOLDER_IMAGE_URL,
          selectedItem: item.selectedItem,
          userName: item.userName || '#UserName',
          balance: item.balance,
          itemsCount: item.itemsCount
        }
      });
    });
  }
}
