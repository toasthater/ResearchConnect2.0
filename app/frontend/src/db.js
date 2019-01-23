import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyCDFaRHYa386BbGjJf0eHShzkjzX06nkVo",
    authDomain: "researchconnect-1d2e4.firebaseapp.com",
    databaseURL: "https://researchconnect-1d2e4.firebaseio.com",
    projectId: "researchconnect-1d2e4",
    storageBucket: "researchconnect-1d2e4.appspot.com",
    messagingSenderId: "126575556233"
});



const auth = firebase.auth();
const firestore = firebase.firestore();

export const Helpers = firebase.firestore;


// Global collections
/** @type firebase.firestore.CollectionReference */
export let users;

export const transaction = (fn) => firestore.runTransaction(fn);

export const getUser = () => auth.currentUser;

// export const userEE = new EventEmitter();


let _userData = null;
export const userData = () => _userData;

const fetchInfo = () => new Promise((resolve) => {
  if (!getUser()) return resolve();

  const unsub = users.doc(getUser().uid).onSnapshot((doc) => {
    _userData = doc.data() || {};

    // userEE.emit('update', _userData);

    resolve();
  }, () => {
    unsub();
    resolve();
  });
});

export const init = () => firestore.enablePersistence()
.catch((err) => {
  if (err.code === 'failed-precondition')
    console.warn('Failed to initialize caching because multiple sessions are open');
  else
    console.error(err);
})
.then(new Promise((resolve) => {
  const unsubscribe = auth.onAuthStateChanged(() => {
    console.log('Signed in:', !!auth.currentUser);
    unsubscribe();
    resolve();
  }, (err) => {
    console.error('Sign in error:', err);
    unsubscribe();
    resolve();
  });
}))
.then(() => {
  users = firestore.collection('users');

  return fetchInfo();
});

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signIn = () => auth.signInWithPopup(googleProvider)
.then(() => new Promise(resolve => setTimeout(() => resolve(), 1500)))
.then(() => fetchInfo())
.then(() => {
  if (_userData && !_userData.setup) return '/setup';

  const { from } = decodeQuery(window.location.search);
  if (from && from.startsWith('/')) return from;
  else if (window.location.pathname === '/') return '/dashboard';
  else return window.location.pathname;
});

export const authChange = (fn) => auth.onAuthStateChanged(fn);

export const signOut = () => auth.signOut();

export const deleteProfile = () => auth.signInWithPopup(googleProvider)
.then(() => auth.currentUser.delete())
.then(() => auth.signOut())
.then(() => alert('Account successfully deleted'));

