import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { map } from 'lodash'
import Page from './Page'

export function PageFirebaseContainer(props) {
  const {
    athletes: athletesDoc,
    applications: applicationsDoc,
    categories: categoriesDoc,
    trainers: trainersDoc,
    tournaments,
    profile
  } = props

  if (isLoaded(athletesDoc, applicationsDoc, categoriesDoc, trainersDoc, tournaments, profile)) {
    const applications = map(applicationsDoc, (elem, key) => ({ ...elem, id: key }))
    const categories = map(categoriesDoc, (elem, key) => ({ ...elem, id: key }))
    const trainers = map(trainersDoc, (elem, key) => ({ ...elem, id: key }))
    let athlets = map(athletesDoc, (elem, key) => ({ ...elem, id: key }))
    athlets = athlets.filter(elem => elem.id !== 'club')
    const loadedProps = {
      athlets,
      applications,
      categories,
      tournaments,
      trainers,
      profile
    }
    return <Page {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

const mapStateToProps = state => {
  const { athletes, applications, categories, trainers } = state.firestore.data
  return {
    athletes,
    applications,
    categories,
    trainers,
    tournaments: state.firestore.ordered.tournaments,
    profile: state.firebase.profile
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { userId, club } = props.profile
    if (userId) {
      // const userFilter = props.isAdmin ? {} : { where: [['createdBy.userId', '==', props.userId]] }
      const userFilter = { where: [['createdBy.userId', '==', userId]] }
      return [
        { collection: 'athletes', doc: userId, storeAs: 'athletes' },
        { collection: 'applications', ...userFilter },
        { collection: 'categories', doc: club, storeAs: 'categories' },
        { collection: 'trainers', doc: club, storeAs: 'trainers' },
        { collection: 'tournaments' }
      ]
    } else return []
  })
)(PageFirebaseContainer)
