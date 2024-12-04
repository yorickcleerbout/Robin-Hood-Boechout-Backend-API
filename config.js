import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  GOOGLE_CALENDAR_API_KEY,
  LUCHTDOELSCHIETEN_ID,
  ROBIN_HOOD_BOECHOUT_ID,
  ANTWERPSE_FEDERATIE_ID,
  BOOGWERELD_ID,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM,
  EMAIL_HOST,
  EMAIL_PORT,
  FIREBASE_TYPE,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_CERT_URL,
  FIREBASE_CLIENT_CERT_URL
} = process.env;

assert(PORT, 'Port is required');
assert(HOST, 'Host is required');

export default {
  port: PORT,
  host: HOST,
  hostUrl: HOST_URL,
  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    serviceAccount: {
      type: FIREBASE_TYPE,
      project_id: PROJECT_ID,
      private_key_id: FIREBASE_PRIVATE_KEY_ID,
      private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle line breaks in private key
      client_email: FIREBASE_CLIENT_EMAIL,
      client_id: FIREBASE_CLIENT_ID,
      auth_uri: FIREBASE_AUTH_URI,
      token_uri: FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: FIREBASE_CLIENT_CERT_URL,
    }
  },
  googleCalendarConfig: {
    apiKey: GOOGLE_CALENDAR_API_KEY,
    luchtdoelschietenId: LUCHTDOELSCHIETEN_ID,
    robinHoodBoechoutId: ROBIN_HOOD_BOECHOUT_ID,
    antwerpseFederatieId: ANTWERPSE_FEDERATIE_ID,
    boogwereldId: BOOGWERELD_ID
  },
  emailConfig: {
    user: EMAIL_USER,
    password: EMAIL_PASSWORD,
    sender: EMAIL_FROM,
    host: EMAIL_HOST,
    port: EMAIL_PORT
  }
};