import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { map } from 'lodash'
import Page from './Page'

export function PageFirebaseContainer(props) {
  const {
    athlets,
    applications,
    categories,
    tournaments,
    trainers,
    userId,
    userName,
    isAdmin
  } = props
  const { add: firestoreAdd, update: firestoreUpdate, delete: firestoreDelete } = props.firestore
  const loadedProps = {
    athlets,
    applications,
    categories,
    tournaments,
    trainers,
    userId,
    userName,
    isAdmin,
    firestoreAdd,
    firestoreUpdate,
    firestoreDelete
  }

  if (isLoaded(athlets, applications, categories, tournaments, trainers)) {
    console.log('categories', categories)
    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

const mapStateToProps = state => {
  const sfo = state.firestore.ordered
  const applications = map(state.firestore.data.applications, (elem, key) => ({ ...elem, id: key }))
  const categories = map(state.firestore.data.categories, (elem, key) => ({ ...elem, id: key }))
  return {
    athlets: sfo.athlets,
    applications,
    categories,
    tournaments: sfo.tournaments,
    trainers: sfo.trainers,
    userId: state.firebase.auth.uid,
    userName: state.firebase.profile.username,
    club: state.firebase.profile.club,
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
      // const userFilter = props.isAdmin ? {} : { where: [['createdBy.userId', '==', props.userId]] }
      const userFilter = { where: [['createdBy.userId', '==', props.userId]] }
      return [
        { collection: 'athlets', ...userFilter },
        { collection: 'applications', ...userFilter },
        { collection: 'categories', doc: props.club, storeAs: 'categories' },
        { collection: 'tournaments' },
        { collection: 'trainers' }
      ]
    } else return []
  })
)(PageFirebaseContainer)
