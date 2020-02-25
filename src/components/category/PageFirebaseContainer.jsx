import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'
import Page from './Page'
import { map } from 'lodash'

function PageFirebaseContainer(props) {
  const { categories: categoriesDoc } = useSelector(state => state.firestore.data)
  const { auth, profile } = useSelector(state => state.firebase)
  const { club } = profile
  useFirestoreConnect([{ collection: 'categories', doc: club, storeAs: 'categories' }])
  if (isLoaded(categoriesDoc, auth, profile)) {
    const categories = map(categoriesDoc, (elem, key) => ({ id: key, ...elem })) || []
    const loadedProps = {
      categories,
      club
    }

    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

export default PageFirebaseContainer
