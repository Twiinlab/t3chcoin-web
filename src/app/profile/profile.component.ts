import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase';

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
  cards = [
    {src: 'assets/cardimages/31e704b1-e61e-4d30-a8ba-97f1f74ef630.jpg', alt: 'Photo1 of a Shiba Inu'},
    {src: 'assets/cardimages/193f5929-cab0-4d54-b4f8-eddc90be0328.jpg', alt: 'Photo2 of a Shiba Inu'},
    {src: 'assets/cardimages/29041744-100f-469e-bb27-79e6a00455cf.jpg', alt: 'Photo3 of a Shiba Inu'},
    {src: 'assets/cardimages/da525caa-2ca4-4371-8609-8c1677551c26.jpg', alt: 'Photo4 of a Shiba Inu'},
    {src: 'assets/cardimages/e97f9ff7-0d33-4186-933e-43cf1faf3350.jpg', alt: 'Photo5 of a Shiba Inu'},
    {src: 'assets/cardimages/e39330f1-708a-4959-a395-7598f1bf1cef.jpg', alt: 'Photo6 of a Shiba Inu'}
  ];

  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth, public snackBar: MatSnackBar) {
    this.user = afAuth.authState;
    this.user.subscribe((user: firebase.User) => {
      console.log(user);
      this.currentUser = user;

      if (user) { // User is signed in!
        this.profilePicStyles = {
          'background-image':  `url(${this.currentUser.photoURL})`
        };

        // We load currently existing chat messages.
        this.messages = this.db.list('/messages', {
          query: {
            limitToLast: 12
          }
        });
        this.messages.subscribe((messages) => {
          // Calculate list of recently discussed topics
          const topicsMap = {};
          const topics = [];
          let hasEntities = false;
          messages.forEach((message) => {
            if (message.entities) {
              for (const entity of message.entities) {
                if (!topicsMap.hasOwnProperty(entity.name)) {
                  topicsMap[entity.name] = 0
                }
                topicsMap[entity.name] += entity.salience;
                hasEntities = true;
              }
            }
          });
          if (hasEntities) {
            for (let name in topicsMap) {
              topics.push({ name, score: topicsMap[name] });
            }
            topics.sort((a, b) => b.score - a.score);
            this.topics = topics.map((topic) => topic.name).join(', ');
          }

          // Make sure new message scroll into view
          setTimeout(() => {
            const messageList = document.getElementById('messages');
            messageList.scrollTop = messageList.scrollHeight;
            document.getElementById('message').focus();
          }, 500);
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
  saveMessage(event: any, el: HTMLInputElement) {
    event.preventDefault();

    if (this.value && this.checkSignedInWithMessage()) {
      // Add a new message entry to the Firebase Database.
      const messages = this.db.list('/messages');
      messages.push({
        name: this.currentUser.displayName,
        text: this.value,
        photoUrl: this.currentUser.photoURL || PROFILE_PLACEHOLDER_IMAGE_URL
      }).then(() => {
        // Clear message text field and SEND button state.
        el.value = '';
      }).catch((err) => {
        this.snackBar.open('Error writing new message to Firebase Database.', null, {
          duration: 5000
        });
        console.error(err);
      });
    }
  }

  // TODO: Refactor into image message form component
  onImageClick(event: any) {
    event.preventDefault();
    document.getElementById('mediaCapture').click();
  }

}
