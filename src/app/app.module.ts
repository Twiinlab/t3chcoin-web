import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ROUTING } from './app.routing';
import { CoreModule } from './core/core.module';

import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { DialogItemComponent } from '../app/profile/dialog-item/dialog-item.component';
import { NotFoundComponent } from './notfound/notfound.component';

import { environment } from '../environments/environment';


const configErrMsg = `You have not configured and imported the Firebase SDK.
Make sure you go through the codelab setup instructions.`;

const bucketErrMsg = `Your Firebase Storage bucket has not been enabled. Sorry
about that. This is actually a Firebase bug that occurs rarely. Please go and
re-generate the Firebase initialization snippet (step 4 of the codelab) and make
sure the storageBucket attribute is not empty. You may also need to visit the
Storage tab and paste the name of your bucket which is displayed there.`;

if (!environment.firebase) {
  if (!environment.firebase.apiKey) {
    window.alert(configErrMsg);
  } else if (environment.firebase.storageBucket === '') {
    window.alert(bucketErrMsg);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    DialogItemComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    MatCardModule,
    MatGridListModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ROUTING
  ],
  providers: [],
  entryComponents: [DialogItemComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
