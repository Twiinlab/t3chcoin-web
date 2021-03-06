/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8080/api',
  firebase: {
    // ***********************************************************************************************************************
    // * TODO(DEVELOPER): Update values according to: Firebase Console > Overview > Add Firebase to your web app. *
    // ***********************************************************************************************************************
    apiKey: 'AIzaSyCUAbfOy3xUtjUPqZgK3CPxT3vR94czE9Q',
    authDomain: 't3chcoinfest.firebaseapp.com',
    databaseURL: 'https://t3chcoinfest.firebaseio.com',
    projectId: 't3chcoinfest',
    storageBucket: 't3chcoinfest.appspot.com',
    messagingSenderId: '622435581699'
  }
};
