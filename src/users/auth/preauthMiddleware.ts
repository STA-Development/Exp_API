import * as admin from 'firebase-admin'

const firebaseConfig = {
  type: process.env.FB_TYPE,
  projectId: process.env.FB_PROJECT_ID,
  privateKeyId: process.env.FB_PRIVATE_KEY_ID,
  privateKey: process.env.FB_PRIVATE_KEY,
  clientEmail: process.env.FB_CLIENT_EMAIL,
  clientId: process.env.FB_CLIENT_ID,
  authUri: process.env.FB_AUTH_URI,
  tokenUri: process.env.FB_TOKEN_URI,
  authProviderX509CertUrl: process.env.FB_AUTH_PROVIDER,
  clientC509CertUrl: process.env.FB_CLIENT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: process.env.FB_DB_URL
});
export const dbAuth = admin.auth();
