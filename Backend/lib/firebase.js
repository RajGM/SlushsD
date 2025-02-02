// firebaseAdmin.js
const { initializeApp, cert  } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const firebaseConfig = {
    //type: process.env.type,
    project_id: process.env.project_id,
    //private_key_id: process.env.private_key_id,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    clientEmail: process.env.client_email,
    // client_id: process.env.client_id,
    // auth_uri: process.env.auth_uri,
    // token_uri: process.env.token_uri,
    // auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    // client_x509_cert_url: process.env.client_x509_cert_url,
    // universe_domain: process.env.universe_domain,
}

//const serviceAccount = require('../admin-sdk.json');
initializeApp({credential:cert (firebaseConfig)});

//---WORKING --- Firebase 11.10.1
//const admin = require('firebase-admin');
// const serviceAccount = require('../admin-sdk2.json');
// if (!admin.apps.length) {
//   admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount)
//   });
// }

// console.log(admin.name);  // '[DEFAULT]'
// const db = admin.firestore();
//---WORKING
const db = getFirestore();

//---TEST-- {Firebase}
// const username = 'rajgm';
// const docId = 'JEWrmWiyRqhcbHeHcPSq';

// async function getDoc(docId) {
//   console.log("INSIDE GET DOC FUNCTION")
//   const docRef = db.collection('history').doc(username).collection('exams').doc(docId);
//   const docSnap = await docRef.get();

//   if (docSnap.exists) {
//     const data = docSnap.data();
//     console.log('Fetched Document Data:', data);
//   } else {
//     console.error('Document does not exist.');
//   }
// }

//getDoc(docId);
//---TEST-- {Firebase}

module.exports = { db }; 