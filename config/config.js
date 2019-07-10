import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyDePSqSS_VZYMri5FG3DZuE3bam9LFXJoE",
    authDomain: "photo-feed-1e42c.firebaseapp.com",
    databaseURL: "https://photo-feed-1e42c.firebaseio.com",
    projectId: "photo-feed-1e42c",
    storageBucket: "photo-feed-1e42c.appspot.com",
    messagingSenderId: "597815629424",
    appId: "1:597815629424:web:8390ed3d88e14f5e"
};
// Initialize Firebase
firebase.initializeApp(config);

export const f=firebase;
export const database = firebase.database()
export const auth = firebase.auth()
export const storage = firebase.storage()
