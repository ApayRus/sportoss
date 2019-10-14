import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { CircularProgress, IconButton, Typography } from '@material-ui/core'
import { categoryName } from '../../config/functions'
import { summarizeTournamentParticipants } from '../../dataFunctions'
import CategoriesTable from '../table/Table'
import GridIcon from '@material-ui/icons/GridOn'
import { Link } from 'react-router-dom'

const columns = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Категория' },
  { id: 'participantsCount', numeric: false, disablePadding: false, label: 'Участников' },
  { id: 'grid', numeric: false, disablePadding: false, label: 'Сетка' }
]

export class Page extends Component {
  render() {
    const { tournament, allCategories, applications } = this.props
    let categories = []
    let participantsCount = 0
    console.log('applications', applications)
    if (isLoaded(allCategories, tournament, applications)) {
      categories = allCategories.filter(cat => tournament.categories.includes(cat.id))
      const tournamentParticipantsInfo = summarizeTournamentParticipants(applications)
      const participantsByCategories = tournamentParticipantsInfo.byCategories
      participantsCount = tournamentParticipantsInfo.count

      categories = categories.map(cat => {
        let participantsCount = 0
        if (participantsByCategories[cat.id])
          participantsCount = participantsByCategories[cat.id].length

        const grid = (
          <IconButton component={Link} to={`/grid/tournament/${tournament.id}/category/${cat.id}/`}>
            <GridIcon />
          </IconButton>
        )

        return { id: cat.id, name: categoryName(cat), participantsCount, grid }
      })
    }

    return (
      <div>
        {isLoaded(tournament) ? (
          <div>
            <h1>{`${tournament.name}, ${tournament.address}, ${tournament.date}`}</h1>
            <Typography variant='body1'>Всего участников: {participantsCount}</Typography>
            <CategoriesTable
              data={categories}
              columns={columns}
              collection='categories'
              title='Категории'
              disableRowClick
              hideToolbar
              hideCheckboxes
            />
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const userId = state.firebase.auth.uid
  const userName = state.firebase.profile.username

  return {
    tournament: state.firestore.data.tournament,
    allCategories: state.firestore.ordered.allCategories,
    applications: state.firestore.ordered.applications,
    user: { userId, userName }
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

//return [{ collection: "athlets", where: [["createdBy.userId", "==", props.user.userId]] }];
