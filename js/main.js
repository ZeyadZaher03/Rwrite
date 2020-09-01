var firebaseConfig = {
    apiKey: "AIzaSyBdZnXHQpoth5nzxDhD2G9exYzIO8Vu3yg",
    authDomain: "rwrite-techzonelabs.firebaseapp.com",
    databaseURL: "https://rwrite-techzonelabs.firebaseio.com",
    projectId: "rwrite-techzonelabs",
    storageBucket: "rwrite-techzonelabs.appspot.com",
    messagingSenderId: "156890537316",
    appId: "1:156890537316:web:352c1be4aefaf2d42d2e71",
    measurementId: "G-1Y4K8VZEWQ"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.database();