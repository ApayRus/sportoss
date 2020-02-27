import React from 'react'
import { map } from 'lodash'
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
  const categories = map(state.firestore.data.categories, (elem, key) => ({ id: key, ...elem }))
  return {
    categories,
    tournaments: state.firestore.ordered.tournaments,
    userId: state.firebase.auth.uid,
    userName: state.firebase.profile.username,
    club: state.firebase.profile.club
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    return [
      { collection: 'categories', doc: props.club, storeAs: 'categories' },
      { collection: 'tournaments', storeAs: 'tournaments' }
    ]
  })
)(PageFirebaseContainer)
