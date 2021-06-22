import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var firebaseConfig = {
  apiKey: 'AIzaSyATCFICfsC6SXT_33ScgT22oC_Aasx5igc',
  authDomain: 'devchat-80ad2.firebaseapp.com',
  databaseURL: 'https://devchat-80ad2-default-rtdb.firebaseio.com/',
  projectId: 'devchat-80ad2',
  storageBucket: 'devchat-80ad2.appspot.com',
  messagingSenderId: '16331449952',
  appId: '1:16331449952:web:c43ddf16cebb0de1ca0505',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
