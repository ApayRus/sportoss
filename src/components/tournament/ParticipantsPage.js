import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { CircularProgress, IconButton, Typography } from '@material-ui/core'
import { athletName, categoryName, trainerName } from '../../config/functions'
import { summarizeTournamentParticipants } from '../../dataFunctions'
import CategoriesTable from '../table/Table'
import GridIcon from '@material-ui/icons/GridOn'
import { Link } from 'react-router-dom'
import { find, map } from 'lodash'
import { ageAtDate } from '../../config/functions'

export class Page extends Component {
  render() {
    const { tournament, allCategories, allTrainers, allAthlets, applications } = this.props
    let categories = []
    let participantsCount = 0
    let participants = []
    // console.log('applications', applications)
    if (isLoaded(allCategories, allTrainers, allAthlets, tournament, applications)) {
      //   categories = allCategories.filter(cat => tournament.categories.includes(cat.id))
      const tournamentParticipantsInfo = summarizeTournamentParticipants(applications)

      const { participants: rawParticipants } = tournamentParticipantsInfo // {athletId, categoryId, trainerId}
      //   console.table(allParticipants)
      participants = map(rawParticipants).map(elem => {
        const athlet = find(allAthlets, { id: elem.athletId })
        const trainer = find(allTrainers, { id: elem.trainerId })
        const category = find(allCategories, { id: elem.categoryId })
        const { minAge, maxAge, gender, weight } = category
        const age = `${minAge}-${maxAge}`
        return { athlet, gender, age, weight, trainer }
      })

      //   console.log('participants', participants)
      //   const participantsByCategories = tournamentParticipantsInfo.byCategories
      participantsCount = tournamentParticipantsInfo.count
    }

    const ParticipantsTable = () => {
      return (
        <table>
          <thead>
            <tr>
              <th>Участник</th>
              <th>Родился</th>
              <th>Лет</th>
              <th>Пол</th>
              <th>Возраст</th>
              <th>Вес</th>
              <th>Тренер</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(elem => (
              <tr>
                <td>{athletName(elem.athlet)}</td>
                <td>{elem.athlet.birthday}</td>
                <td>{ageAtDate(elem.athlet.birthday, tournament.dateAge || tournament.date)}</td>
                <td>{elem.gender}</td>
                <td>{elem.age}</td>
                <td>{elem.weight}</td>
                <td>{trainerName(elem.trainer)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    return (
      <div>
        {isLoaded(tournament) ? (
          <div>
            <h1>{`${tournament.name}, ${tournament.address}, ${tournament.date}`}</h1>
            <Typography variant='body1'>Всего участников: {participantsCount}</Typography>
            <ParticipantsTable />
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    tournament: state.firestore.data.tournament,
    allCategories: state.firestore.ordered.allCategories,
    allTrainers: state.firestore.ordered.allTrainers,
    allAthlets: state.firestore.ordered.allAthlets,
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
      { collection: 'athlets', storeAs: 'allAthlets' },
      { collection: 'trainers', storeAs: 'allTrainers' },
      { collection: 'applications', where: [['tournamentId', '==', tournamentId]] }
    ]
  })
)(Page)

//return [{ collection: "athlets", where: [["createdBy.userId", "==", props.user.userId]] }];
