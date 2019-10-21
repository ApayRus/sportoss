import React from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import ListPage from './ListPage'
import { CircularProgress } from '@material-ui/core'

export function Page(props) {
  const { tournament, allCategories, applications } = props
  const loadedProps = { tournament, allCategories, applications }
  if (isLoaded(allCategories, tournament, applications)) {
    return <ListPage {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

const mapStateToProps = state => {
  return {
    tournament: state.firestore.data.tournament,
    allCategories: state.firestore.ordered.allCategories,
    applications: state.firestore.ordered.applications
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId } = props.match.params
    return [
      { collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
      { collection: 'categories', storeAs: 'allCategories' },
      { collection: 'applications', where: [['tournamentId', '==', tournamentId]] }
    ]
  })
)(Page)
