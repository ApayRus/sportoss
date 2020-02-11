import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import Page from './Page'

export function PageFirebaseContainer(props) {
  const { athlets, userId, userName /* isAdmin */ } = props
  const { add: firestoreAdd, update: firestoreUpdate, delete: firestoreDelete } = props.firestore
  const loadedProps = { athlets, userId, userName, firestoreAdd, firestoreUpdate, firestoreDelete }

  if (isLoaded(athlets)) {
    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

const mapStateToProps = state => {
  return {
    athlets: state.firestore.ordered.athlets,
    userId: state.firebase.auth.uid,
    userName: state.firebase.profile.username,
    isAdmin:
      isLoaded(state.firebase.profile) && !state.firebase.profile.isEmpty
        ? state.firebase.profile.roles.admin
        : false
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    if (props.userId) {
      const userFilter = props.isAdmin ? {} : { where: [['createdBy.userId', '==', props.userId]] }
      return [{ collection: 'athlets', ...userFilter }]
    } else return []
  })
)(PageFirebaseContainer)
