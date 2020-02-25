import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'
import Page from './Page'
import { map } from 'lodash'

function PageFirebaseContainer(props) {
  const { categories: categoriesDoc } = useSelector(state => state.firestore.data)
  const { profile } = useSelector(state => state.firebase)
  useFirestoreConnect([{ collection: 'categories', doc: profile.club, storeAs: 'categories' }])
  if (isLoaded(categoriesDoc, profile)) {
    const categories = map(categoriesDoc, (elem, key) => ({ id: key, ...elem })) || []
    const loadedProps = {
      categories,
      profile
    }

    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

export default PageFirebaseContainer
