import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { CircularProgress, Typography } from '@material-ui/core'
import { athletName, trainerName } from '../../config/functions'
import { summarizeTournamentParticipants } from '../../dataFunctions'
import { find, map } from 'lodash'
import { ageAtDate } from '../../config/functions'

export class Page extends Component {
  render() {
    const { tournament, categories, trainers, athletes, applications } = this.props
    let participantsCount = 0
    let participants = []
    if (isLoaded(categories, trainers, athletes, tournament, applications)) {
      const tournamentParticipantsInfo = summarizeTournamentParticipants(applications)
      const allCategories = map(categories, (elem, key) => ({ id: key, ...elem }))
      const allTrainers = map(trainers, (elem, key) => ({ ...elem, id: key }))
      const allAthlets = map(athletes, (elem, key) => ({ ...elem, id: key }))
      const { participants: rawParticipants } = tournamentParticipantsInfo // {athletId, categoryId, trainerId}
      participants = map(rawParticipants).map(elem => {
        const athlet = find(allAthlets, { id: elem.athletId })
        const trainer = find(allTrainers, { id: elem.trainerId })
        const category = find(allCategories, { id: elem.categoryId })
        const { minAge, maxAge, gender, weight } = category
        const age = `${minAge}-${maxAge}`
        return { athlet, gender, age, weight, trainer }
      })

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
              <tr key={`partic-${elem.athlet.id}`}>
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
  const { categories, trainers, athletes } = state.firestore.data
  return {
    tournament: state.firestore.data.tournament,
    categories,
    trainers,
    athletes,
    applications: state.firestore.ordered.applications,
    club: state.firebase.profile.club,
    userId: state.firebase.profile.userId
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId } = props.match.params
    return [
      { collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
      { collection: 'categories', doc: props.club, storeAs: 'categories' },
      { collection: 'trainers', doc: props.club, storeAs: 'trainers' },
      { collection: 'athletes', doc: props.userId, storeAs: 'athletes' },
      { collection: 'applications', where: [['tournamentId', '==', tournamentId]] }
    ]
  })
)(Page)
