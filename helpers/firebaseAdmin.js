import admin from 'firebase-admin';
import config from '../config.js';

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(config.firebaseConfig.serviceAccount), 
});

export default firebaseAdmin;