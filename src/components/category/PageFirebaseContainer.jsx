import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { isLoaded, useFirestoreConnect, useFirestore } from 'react-redux-firebase'
import Page from './Page'

function PageFirebaseContainer(props) {
  useFirestoreConnect([{ collection: 'categories' }])
  const firestore = useFirestore()
  const { add: firestoreAdd, update: firestoreUpdate, delete: firestoreDelete } = firestore
  const { categories } = useSelector(state => state.firestore.ordered)
  const { uid: userId } = useSelector(state => state.firebase.auth)
  const { username: userName } = useSelector(state => state.firebase.profile)
  const loadedProps = {
    categories,
    userId,
    userName,
    firestoreAdd,
    firestoreUpdate,
    firestoreDelete
  }

  if (isLoaded(categories)) {
    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

export default PageFirebaseContainer
