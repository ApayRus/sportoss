import React from 'react'
import Duel from '../Duel'
import { useDispatch, useSelector } from 'react-redux'
import { find } from 'lodash'
import { gridByLevelsWithFakeDuelsInZeroTour } from './functionsPlayOff'
import { updateFighter, setWinner } from '../../../store/gridActions'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  levelBox: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'space-around'
  }
}))

function Grid(props) {
  const { grid, participants } = useSelector(state => state.grid)
  const classes = useStyles()
  const dispatch = useDispatch()

  const onFighterChange = duelId => e => {
    const { color: fighterColor } = e.target.dataset
    const [familyName, firstName] = e.target.value.split(' ')
    const relatedParticipant = find(participants, { athlet: { familyName, firstName } })
    const athletId = relatedParticipant ? relatedParticipant.athlet.id : ''
    dispatch(updateFighter({ duelId, fighterColor, athletId }))
  }

  const onWinnerChange = (duelId, athletId) => e => {
    const operation = e.target.checked ? 'set' : 'reset'
    dispatch(setWinner({ duelId, athletId, operation }))
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

export default Grid
