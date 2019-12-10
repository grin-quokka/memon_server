import * as firebase from 'firebase/app';
import * as admin from 'firebase-admin';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

export default function(idToken) {
  firebase.initializeApp(firebaseConfig);

  const serviceAccount = require('../serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://memon-0625.firebaseio.com'
  });

  // TODO: async await으로 uid 리턴하기

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      let uid = decodedToken.uid;
      console.log(uid);
    })
    .catch(error => {
      console.log('에러', error);
    });
}
