import React from 'react'
import Duel from '../Duel'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { find } from 'lodash'
import { gridByLevelsWithFakeDuelsInZeroTour } from './functionsPlayOff'

import { updateFighter, setWinner } from '../../../store/gridActions'
import { withStyles } from '@material-ui/core/styles'

function Grid(props) {
  const { grid, classes, participants, updateFighter, setWinner } = props

  const onFighterChange = duelId => e => {
    const { color: fighterColor } = e.target.dataset
    const [familyName, firstName] = e.target.value.split(' ')

    const relatedParticipant = find(participants, { athlet: { familyName, firstName } })
    const athletId = relatedParticipant ? relatedParticipant.athlet.id : ''
    updateFighter({ duelId, fighterColor, athletId })
  }

  const onWinnerChange = duelId => e => {
    const { winner: athletId = '' } = e.target.dataset
    const operation = e.target.checked ? 'set' : 'reset'
    setWinner({ duelId, athletId, operation })
  }

  const eventHandlers = { onWinnerChange, onFighterChange }

  const gridByLevels = gridByLevelsWithFakeDuelsInZeroTour(grid)

  return (
    <div style={{ display: 'flex' }}>
      {Object.keys(gridByLevels).map(key => (
        <div key={key} className={classes.levelBox}>
          {gridByLevels[key].map(duel => (
            <Duel
              duelData={duel}
              participants={participants}
              key={duel.id}
              showWinnerCheckbox={true}
              {...eventHandlers}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

const styles = {
  levelBox: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'space-around'
  }
}

const mapStateToProps = state => ({
  participants: state.grid.participants,
  grid: state.grid.grid
})

const mapDispatchToProps = dispatch => ({
  updateFighter: payload => dispatch(updateFighter(payload)),
  setWinner: payload => dispatch(setWinner(payload))
})

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(Grid)
