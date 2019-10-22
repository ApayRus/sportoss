import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import Page from './Page'

function PageFirebaseContainer(props) {
  const { categories, tournaments, userId, userName } = props
  const { add: firestoreAdd, update: firestoreUpdate, delete: firestoreDelete } = props.firestore
  const loadedProps = {
    categories,
    tournaments,
    userId,
    userName,
    firestoreAdd,
    firestoreUpdate,
    firestoreDelete
  }

  if (isLoaded(tournaments, categories)) {
    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

const mapStateToProps = state => {
  return {
    categories: state.firestore.ordered.categories,
    tournaments: state.firestore.ordered.tournaments,
    userId: state.firebase.auth.uid,
    userName: state.firebase.profile.username
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: 'categories' }, { collection: 'tournaments' }])
)(PageFirebaseContainer)
