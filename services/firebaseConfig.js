// firebaseConfig.mjs
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function logga(){
    console.log("__dirname",path.join(__dirname, 'config/firebase-adminsdk.json'));
    
}

const serviceAccount = JSON.parse(
  await readFile(path.join(__dirname, 'config/dragna272-firebase-adminsdk-rbxzv-d8cf6fbf49.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'dragna272.appspot.com', // 👈 change to your actual bucket
});

const bucket = admin.storage().bucket();

export default bucket;
