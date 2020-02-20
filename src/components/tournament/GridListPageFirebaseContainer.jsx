import React from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import ListPage from './GridListPage'
import { CircularProgress } from '@material-ui/core'

export function Page(props) {
  const { tournament, allCategories, applications, grids } = props
  const loadedProps = { tournament, allCategories, applications, grids }
  if (isLoaded(allCategories, tournament, applications, grids)) {
    return <ListPage {...loadedProps} />
  } else {
    return <CircularProgress />
  }
}

const mapStateToProps = state => {
  return {
    tournament: state.firestore.data.tournament,
    allCategories: state.firestore.ordered.allCategories,
    applications: state.firestore.ordered.applications,
    grids: state.firestore.data.grids
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId } = props.match.params
    return [
      { collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
      { collection: 'grids', doc: `${tournamentId}`, storeAs: 'grids' },
      { collection: 'categories', storeAs: 'allCategories' },
      { collection: 'applications', where: [['tournamentId', '==', tournamentId]] }
    ]
  })
)(Page)
