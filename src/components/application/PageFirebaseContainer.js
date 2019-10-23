import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import Page from './Page'

export function PageFirebaseContainer(props) {
  const { athlets, applications, categories, tournaments, trainers, userId, userName } = props
  const { add: firestoreAdd, update: firestoreUpdate, delete: firestoreDelete } = props.firestore
  const loadedProps = {
    athlets,
    applications,
    categories,
    tournaments,
    trainers,
    userId,
    userName,
    firestoreAdd,
    firestoreUpdate,
    firestoreDelete
  }

  if (isLoaded(athlets, applications, categories, tournaments, trainers)) {
    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

const mapStateToProps = state => {
  const sfo = state.firestore.ordered
  return {
    athlets: sfo.athlets,
    applications: sfo.applications,
    categories: sfo.categories,
    tournaments: sfo.tournaments,
    trainers: sfo.trainers,
    userId: state.firebase.auth.uid,
    userName: state.firebase.profile.username
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    if (props.userId)
      return [
        { collection: 'athlets', where: [['createdBy.userId', '==', props.userId]] },
        { collection: 'applications', where: [['createdBy.userId', '==', props.userId]] },
        { collection: 'categories' },
        { collection: 'tournaments' },
        { collection: 'trainers' }
      ]
    else return []
  })
)(PageFirebaseContainer)
