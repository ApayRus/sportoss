import React from 'react'
import Duel from './Duel'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { find } from 'lodash'
import { gridByLevels as gridByLevelsFunction } from './functionsPlayOff'
import { Typography } from '@material-ui/core'

import { updateFighter, setWinner } from '../../store/gridActions'
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
    const winnerId = e.target.checked ? e.target.dataset.winner : ''
    setWinner({ duelId, athletId: winnerId })
  }

  const eventHandlers = { onWinnerChange, onFighterChange }

  const gridByLevels = gridByLevelsFunction(grid)
  return (
    <div /* style={{ display: 'flex' }} */>
      {Object.keys(gridByLevels).map(key => (
        <div key={key} /* className={classes.levelBox} */>
          <Typography variant='subtitle2' color='textSecondary'>
            Тур {key}
          </Typography>
          {gridByLevels[key].map(duel => (
            <Duel duelData={duel} participants={participants} key={duel.id} {...eventHandlers} />
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

const mapDispatchToProps = dispatch => ({
  updateFighter: payload => dispatch(updateFighter(payload)),
  setWinner: payload => dispatch(setWinner(payload))
})

export default compose(
  withStyles(styles),
  connect(
    null,
    mapDispatchToProps
  )
)(Grid)
