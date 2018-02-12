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

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public snackBar: MatSnackBar,
    public t3chcoinService: T3chcoinService) {
    this.user = afAuth.authState;
    this.user.subscribe((user: firebase.User) => {
      console.log(user);
      this.currentUser = user;

      if (user) { // User is signed in!
        this.profilePicStyles = {
          'background-image':  `url(${this.currentUser.photoURL})`
        };
        // user.providerData[0].displayName
        t3chcoinService.getUser(user.providerData[0].uid)
        .subscribe(myUser => {
          if (myUser.userName === '') {
            t3chcoinService.AddUser(
              user.providerData[0].uid,
              user.providerData[0].displayName,
              user.providerData[0].uid)
              .subscribe(result => {
                console.log(result);
              });
          } else {
            this.currenUserProfile = myUser;
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

  // TODO: Refactor into text message form component
  saveMessage(event: any, el: HTMLInputElement) { }

  // TODO: Refactor into image message form component
  onImageClick(event: any) { }

}
