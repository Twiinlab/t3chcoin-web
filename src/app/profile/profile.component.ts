import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase';

import { T3chcoinService } from '../core/t3chcoin/t3chcoin.service';


const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: Observable<firebase.User>;
  currentUser: firebase.User;
  messages: FirebaseListObservable<any>;
  profilePicStyles: {};
  topics = '';
  value = '';
  currenUserProfile: any;
  currenSocialProfile: any;
  itemsCatalog: any;
  cards = [
    {src: 'assets/cardimages/31e704b1-e61e-4d30-a8ba-97f1f74ef630.jpg', alt: 'Photo1 of a Shiba Inu'},
    {src: 'assets/cardimages/193f5929-cab0-4d54-b4f8-eddc90be0328.jpg', alt: 'Photo2 of a Shiba Inu'},
    {src: 'assets/cardimages/29041744-100f-469e-bb27-79e6a00455cf.jpg', alt: 'Photo3 of a Shiba Inu'},
    {src: 'assets/cardimages/da525caa-2ca4-4371-8609-8c1677551c26.jpg', alt: 'Photo4 of a Shiba Inu'},
    {src: 'assets/cardimages/e97f9ff7-0d33-4186-933e-43cf1faf3350.jpg', alt: 'Photo5 of a Shiba Inu'},
    {src: 'assets/cardimages/e39330f1-708a-4959-a395-7598f1bf1cef.jpg', alt: 'Photo6 of a Shiba Inu'}
  ];

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public snackBar: MatSnackBar,
    public t3chcoinService: T3chcoinService) {
    this.user = afAuth.authState;
    this.userListener();
    this.initCatalog();
  }

  initCatalog() {
    const self = this;
    self.t3chcoinService.getItemsCatalog()
        .subscribe(catalog => {
          self.itemsCatalog = catalog.map(item => {
            item.src = self.cards[item.itemId % self.cards.length].src;
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
        this.topics = '';
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

  buyItem(item) {
    const self = this;
    this.t3chcoinService.buyItem(this.currenUserProfile.userId, item.itemId)
    .subscribe(result => {
      self.getUserProfile(this.currenUserProfile.userId);
    });
  }

  changeSelectedItem(item) {
    this.currenUserProfile.selectedItem = item.itemId;
    this.updateSelectedItem();
  }

  updateSelectedItem() {
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
  }

  fillSocialProfile(socialProfile) {
    this.currenSocialProfile = socialProfile;
  }

  getSrcImage(selectedItem) {
    const selected = this.itemsCatalog.filter(item => item.itemId === selectedItem);
    return (selected.length > 0 ? selected[0].src : 'https://material.angular.io/assets/img/examples/shiba2.jpg');
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

  // TODO: Refactor into text message form component
  update(value: string) {
    this.value = value;
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

}
