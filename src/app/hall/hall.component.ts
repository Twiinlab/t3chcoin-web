import { Component, OnInit } from '@angular/core';
import { T3chcoinService } from '../core/t3chcoin/t3chcoin.service';

const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';

@Component({
  selector: 'hall',
  templateUrl: './hall.component.html',
  styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit {

  userMessages: any;
  socialMessages: any;
  itemsCatalog: Array<any> = [];
  avatars: Array<any> = [];
  stickers: Array<any> = [];
  tableSocialColumns = ['avatar', 'selectedItem', 'userName', 'totalTwit', 'totalTwitRetweet', 'totalTwitLike', 'balance'];
  tableUserColumns = ['avatar', 'selectedItem', 'userName', 'itemsCount', 'balance'];

  constructor(public t3chcoinService: T3chcoinService) { }

  ngOnInit() {
    this.initAssets();
    this.initCatalog();
    this.initSocialMessage();
    // this.initUserMessage()
  }

  initSocialMessage() {
    const self = this;
    this.t3chcoinService
    .getTopFillSocials()
    .subscribe(socials => {
      this.socialMessages = socials.map(social => {
        return {
        avatar: social.user.avatar,
        selectedItem: social.user.selectedItem,
        userName: social.user.userName,
        balance: social.user.balance,
        totalTwit: social.totalTwit,
        totalTwitLike: social.totalTwitLike,
        totalTwitRetweet: social.totalTwitRetweet
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

  initAssets() {
    for (let i = 1; i < 21; i++) {
      this.stickers.push({ src: './assets/stickers/sticker' + i + '.png'});
    }
    for (let i = 1; i < 5; i++) {
      this.avatars.push(['./assets/avatars/girl-simple' + i + '.png', './assets/avatars/boy-simple' + i + '.png']);
    }
  }

  initCatalog() {
    const self = this;
    self.t3chcoinService.getItemsCatalog()
        .subscribe(catalog => {
          self.itemsCatalog = catalog.map(item => {
            item.src = (self.stickers[(item.itemId % self.stickers.length)]).src;
            return item;
          });
        });
  }

  getSrcAvatar(originAvatar) {
    const avatar = this.convertAvatar(originAvatar);
    return (this.avatars[avatar.hobbie][avatar.sex]) ? this.avatars[avatar.hobbie][avatar.sex] : this.avatars[0][0];
  }

  getSrcSticker(selectedItem) {
    const selected = this.itemsCatalog.filter(item => item.itemId === selectedItem);
    return (selected.length > 0 ? selected[0].src : './assets/stickers/sticker0.png');
  }

  convertAvatar(avatar) {
    const avatarInt = !isNaN(parseInt(avatar, 10)) ? parseInt(avatar, 10) : 0;
    return {
      hobbie: (avatarInt % 10) % 4,
      sex:  (Math.round(avatarInt / 10) > 0) ? 1 : 0
    };
  }

}
