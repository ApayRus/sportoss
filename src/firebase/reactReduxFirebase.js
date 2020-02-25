import firebase from './firebase'
import store from '../store/rootReducer'
import { createFirestoreInstance } from 'redux-firestore'

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
  profileFactory: (userData, profileData) => {
    return {
      ...profileData,
      userId: userData.user.uid,
      email: userData.user.email
    }
  }
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

export { rrfProps }
