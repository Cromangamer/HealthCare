const admin = require("firebase-admin");
let credential;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    credential = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
} else {
    credential = admin.credential.cert(require("../secrets/firebase-service-account.json"));
}
if (!admin.apps.length) admin.initializeApp({ credential });

module.exports = admin;
