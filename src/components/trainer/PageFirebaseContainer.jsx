import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import Page from './Page'
import { map } from 'lodash'

export function PageFirebaseContainer(props) {
  const { profile } = useSelector(state => state.firebase)
  const { trainers: trainersDoc } = useSelector(state => state.firestore.data)
  useFirestoreConnect([{ collection: 'trainers', doc: profile.club, storeAs: 'trainers' }])

  if (isLoaded(trainersDoc, profile)) {
    const trainers = map(trainersDoc, (elem, key) => ({ id: key, ...elem })) || []
    const loadedProps = { trainers, profile }
    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

export default PageFirebaseContainer
