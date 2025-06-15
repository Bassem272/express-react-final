import dotenv from "dotenv"
import admin from 'firebase-admin';
dotenv.config(); 

const base64 = process.env.FIREBASE_CREDENTIALS_BASE64;

if (!base64) {
  throw new Error("FIREBASE_CREDENTIALS_BASE64 is not set");
}

const serviceAccount = JSON.parse(
  Buffer.from(base64, 'base64').toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'dragna272.appspot.com',
});

const bucket = admin.storage().bucket();
export default bucket;
