import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'
import Page from './Page'
import { map } from 'lodash'

function PageFirebaseContainer(props) {
  const { athletes: athletsDoc } = useSelector(state => state.firestore.data)
  const { profile } = useSelector(state => state.firebase)
  useFirestoreConnect([{ collection: 'athletes', doc: profile.userId, storeAs: 'athletes' }])
  if (isLoaded(athletsDoc, profile)) {
    let athlets = map(athletsDoc, (elem, key) => ({ id: key, ...elem })) || []
    athlets = athlets.filter(elem => elem.id !== 'club')
    //we store club near by athletes then we should remove it before show athletes
    const loadedProps = {
      athlets,
      profile
    }

    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

export default PageFirebaseContainer
