import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import { CircularProgress, Select, Typography } from '@material-ui/core'
import { participantsGroupedByCategories } from '../../dataFunctions'
import { map, sortBy, find } from 'lodash'
import { randomColor } from 'randomcolor'
import { gridByLevels } from './functions'

import { athletName, categoryName, trainerName, tournamentName } from '../../config/functions'
import ColoredPerson from './ColoredPerson'
import Grid from './Grid'

export class Page extends Component {
  handleChange = e => {
    console.log('e.target.id', e.target.id)
    console.log('e.target', e.target)
    console.log('e.target.value', e.target.value)
    /*     this.setState({
      [e.target.dataset.id]: e.target.value
    }) */
  }

  render() {
    const { tournament, category, applications, allAthlets, allTrainers, grid } = this.props
    const { categoryId } = this.props.match.params
    let participants = []
    let athletIds = []
    let trainerIds = []
    let athlets = []
    let trainers = []
    let trainerColors = {}
    let Participants = []

    if (isLoaded(applications, category, allAthlets, allTrainers)) {
      participants = participantsGroupedByCategories(applications)[categoryId]
      athletIds = map(participants, 'athletId') // ['1111', '2222', '3333', ...]
      trainerIds = map(participants, 'trainerId') // ['1111', '2222', '3333', ...]
      trainerIds.forEach(trainerId => {
        trainerColors[trainerId] = randomColor()
      })
      participants = sortBy(participants, 'trainerId')
      athlets = allAthlets.filter(athlet => athletIds.includes(athlet.id))
      trainers = allTrainers.filter(trainer => trainerIds.includes(trainer.id))
      Participants = () => {
        return (
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            {participants.map(par => {
              const color = trainerColors[par.trainerId]
              const athlet = find(athlets, { id: par.athletId })
              const name = athletName(athlet)
              const key = par.athletId
              const props = {
                color,
                name,
                key
              }
              return <ColoredPerson {...props} />
            })}
          </div>
        )
      }
    }

    return (
      <div>
        {isLoaded(tournament, category, allAthlets, allTrainers, applications) ? (
          <div>
            <h1>Форма категории</h1>
            <h2>{categoryName(category)}</h2>
            <h3>{tournamentName(tournament)}</h3>
            <Select
              onChange={this.handleChange}
              native
              inputProps={{
                id: 'tossType'
              }}
            >
              <option value=''></option>
              <option value='playOff'>Олимпийская</option>
              <option value='circle'>Круговая</option>
              <option value='group'>Групповая</option>
            </Select>

            {/* <Duel participant1={Participants[0]} participant2={Participants[1]} /> */}
            <div>
              {trainers.map(trainer => {
                const color = trainerColors[trainer.id]
                const name = trainerName(trainer)
                const key = trainer.id
                const props = {
                  color,
                  name,
                  key
                }
                return <ColoredPerson {...props} />
              })}
            </div>
            <Typography variant='h6'>Сетка</Typography>
            <div style={{ display: 'flex' }}>
              <Participants />
              <Grid grid={gridByLevels(grid)} />
            </div>
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
    category: state.firestore.data.category,
    allAthlets: state.firestore.ordered.allAthlets,
    allTrainers: state.firestore.ordered.allTrainers,
    applications: state.firestore.ordered.applications,
    grid: state.grid.grid,
    user: { userId, userName }
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId, categoryId } = props.match.params
    return [
      { collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
      { collection: 'categories', doc: categoryId, storeAs: 'category' },
      { collection: 'applications', where: [['tournamentId', '==', tournamentId]] },
      { collection: 'athlets', storeAs: 'allAthlets' },
      { collection: 'trainers', storeAs: 'allTrainers' }
    ]
  })
)(Page)
