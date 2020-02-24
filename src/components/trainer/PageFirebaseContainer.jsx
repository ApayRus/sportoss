import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import Page from './Page'

export function PageFirebaseContainer(props) {
  const { trainers, userId, userName } = props
  const { add: firestoreAdd, update: firestoreUpdate, delete: firestoreDelete } = props.firestore
  const loadedProps = { trainers, userId, userName, firestoreAdd, firestoreUpdate, firestoreDelete }

  if (isLoaded(trainers)) {
    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

const mapStateToProps = state => {
  return {
    trainers: state.firestore.ordered.trainers,
    userId: state.firebase.auth.uid,
    userName: state.firebase.profile.username
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    if (props.userId) return [{ collection: 'trainers' }]
    else return []
  })
)(PageFirebaseContainer)
