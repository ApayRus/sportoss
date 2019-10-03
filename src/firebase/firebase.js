import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import firebaseConfig from '../config/firebase'

firebase.initializeApp(firebaseConfig)

firebase.firestore()
// firebase.storage()

export default firebase
