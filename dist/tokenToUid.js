"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase/app");
const admin = require("firebase-admin");
require("firebase/auth");
const firebaseConfig_1 = require("./firebaseConfig");
function default_1(idToken) {
    firebase.initializeApp(firebaseConfig_1.default);
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
exports.default = default_1;
//# sourceMappingURL=tokenToUid.js.map