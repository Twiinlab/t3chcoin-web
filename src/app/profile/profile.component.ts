import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar, MatDialog } from '@angular/material';
import * as firebase from 'firebase';

import { T3chcoinService } from '../core/t3chcoin/t3chcoin.service';
import { DialogItemComponent } from './dialog-item/dialog-item.component';



const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: Observable<firebase.User>;
  currentUser: firebase.User;
  messages: FirebaseListObservable<any>;
  profilePicStyles: {};

  currenUserProfile: any;
  currenSocialProfile: any;
  itemsCatalog: any;

  avatars: Array<any> = [];
  stickers: Array<any> = [];

  cards = [
    {src: 'assets/cardimages/31e704b1-e61e-4d30-a8ba-97f1f74ef630.jpg'},
    {src: 'assets/cardimages/193f5929-cab0-4d54-b4f8-eddc90be0328.jpg'},
    {src: 'assets/cardimages/29041744-100f-469e-bb27-79e6a00455cf.jpg'},
    {src: 'assets/cardimages/da525caa-2ca4-4371-8609-8c1677551c26.jpg'},
    {src: 'assets/cardimages/e97f9ff7-0d33-4186-933e-43cf1faf3350.jpg'},
    {src: 'assets/cardimages/e39330f1-708a-4959-a395-7598f1bf1cef.jpg'}
  ];

  groupHobbieInit = 1;
  groupSexInit = 1;
  currentSelectedItem: any;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public snackBar: MatSnackBar,
    public t3chcoinService: T3chcoinService,
    public dialog: MatDialog) {
    this.user = afAuth.authState;
    this.userListener();
    this.initAssets();
    this.initCatalog();
  }

  initAssets() {
    for (let i = 1; i < 21; i++) {
      this.stickers.push({ src: './assets/stickers/sticker' + i + '.png'});
    }
    for (let i = 1; i < 5; i++) {
      this.avatars.push({ src: './assets/avatars/avatar' + i + '.png'});
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

  userListener() {
    this.user.subscribe((user: firebase.User) => {
      console.log(user);
      const self = this;
      this.currentUser = user;
      if (user) { // User is signed in!
        this.profilePicStyles = {
          'background-image':  `url(${this.currentUser.photoURL})`
        };
        // user.providerData[0].displayName
        self.t3chcoinService.getUser(user.providerData[0].uid)
        .subscribe(myUser => {
          if (myUser.userName === '') {
            self.addUser(self.currentUser.providerData[0]);
          } else {
            self.fillUserProfile(myUser);
            self.getSocialProfile(myUser.userId);
          }
        });
      } else { // User is signed out!
        this.profilePicStyles = {
          'background-image':  PROFILE_PLACEHOLDER_IMAGE_URL
        };
      }
    });
  }

  addUser(user) {
    const self = this;
    this.t3chcoinService.addUser(
      user.uid,
      user.displayName,
      user.uid)
      .subscribe(result => {
        self.getUserProfile(user.uid);
        self.getSocialProfile(user.uid);
      });
  }

  buyItem(itemId) {
    const self = this;
    this.t3chcoinService.buyItem(this.currenUserProfile.userId, itemId)
    .subscribe(result => {
        self.getUserProfile(this.currenUserProfile.userId);
      },
      err => {
        self.showMessage('Sorry, You don´t have enough tokens', 'Let´s Twits');
      });
  }

  changeSelectedItem(item) {
    this.currenUserProfile.selectedItem = item.itemId;
    this.updateUser();
  }

  updateUser() {
    const self = this;
    this.t3chcoinService.updateUser(
      self.currenUserProfile.userId,
      self.currenUserProfile.userName,
      self.currenUserProfile.avatar,
      self.currenUserProfile.selectedItem)
    .subscribe(result => {
      self.getUserProfile(this.currenUserProfile.userId);
    });
  }

  changeHobbie(event) {
    console.log(event);
    this.groupHobbieInit = event.value;
    this.currenUserProfile.avatar = this.groupSexInit + event.value;
    this.updateUser();
  }

  changeSex(event) {
    console.log(event);
    this.groupSexInit = event.value;
    this.currenUserProfile.avatar = event.value + this.groupHobbieInit;
    this.updateUser();
  }

  getUserProfile(userId) {
    const self = this;
    this.t3chcoinService.getUser(userId)
    .subscribe(myUser => {
      self.fillUserProfile(myUser);
    });
  }

  getSocialProfile(userId) {
    const self = this;
    this.t3chcoinService.getSocial(userId)
    .subscribe(mySocial => {
      self.fillSocialProfile(mySocial);
    });
  }

  fillUserProfile(userProfile) {
    this.currenUserProfile = userProfile;
    this.updateAvatar(userProfile.avatar);
  }

  updateAvatar(avatar) {
    const avatarInt = !isNaN(parseInt(avatar, 10)) ? parseInt(avatar, 10) : 0;
    this.groupHobbieInit = (avatarInt % 10) % 4;
    this.groupSexInit = (Math.round(avatarInt / 10) > 0) ? 1 : 0;
  }

  fillSocialProfile(socialProfile) {
    this.currenSocialProfile = socialProfile;
  }

  getSrcAvatar(selectedAvatar) {
    return (this.avatars[selectedAvatar].src) ? this.avatars[selectedAvatar].src : './assets/avatars/avatar1.png';
  }

  getSrcSticker(selectedItem) {
    const selected = this.itemsCatalog.filter(item => item.itemId === selectedItem);
    return (selected.length > 0 ? selected[0].src : './assets/stickers/sticker0.png');
  }

  checkContainsItem(itemId) {
    return this.currenUserProfile && (this.currenUserProfile.items.indexOf(itemId) === -1);
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider()); // GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  // Returns true if user is signed-in. Otherwise false and displays a message.
  checkSignedInWithMessage() {
    // Return true if the user is signed in Firebase
    if (this.currentUser) {
      return true;
    }

    this.snackBar
      .open('You must sign-in first', 'Sign in', {
        duration: 5000
      })
      .onAction()
      .subscribe(() => this.login());

    return false;
  };

  showMessage(messageTitle: string, messageBody: string) {
    this.snackBar
      .open(messageTitle, messageBody, {
        duration: 5000
      })
      .onAction()
      .subscribe(() => window.open('https://twitter.com'));
  }

  openDialog(item): void {
    const self = this;
    self.currentSelectedItem = item;
    const dialogRef = this.dialog.open(DialogItemComponent, {
      width: '20%',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buyItem(self.currentSelectedItem.itemId);
      }
    });
  }

}
