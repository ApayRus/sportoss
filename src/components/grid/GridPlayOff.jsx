import React from 'react'
import Duel from './Duel'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { find } from 'lodash'
import { gridByLevels as gridByLevelsFunction } from './functionsPlayOff'

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
    // const duelId = id
    const duel = grid[duelId]
    setWinner({ duelId, athletId: winnerId })

    const fillNextRoundByWinners = () => {
      //winner goes to the next round (level)
      const duelNextId = duel.next
      if (duelNextId) {
        const duelNext = grid[duelNextId]
        const fighterColor = duelNext.fighterRed ? 'Blue' : 'Red'
        updateFighter({ duelId: duelNextId, fighterColor, athletId: winnerId })
      }
    }

    const fillDuelFor3rdPlaceByLosers = () => {
      //in 1/2 finals, loser goes to Duel for 3rd place, also it is a last Duel in Grid
      const duelTotalCount = Object.keys(grid).length
      const { fighterRed, fighterBlue } = duel
      const loserId = winnerId === fighterRed ? fighterBlue : fighterRed

      if (+duelId === duelTotalCount - 3)
        //1-st of 1/2 finals
        updateFighter({ duelId: duelTotalCount, fighterColor: 'Red', athletId: loserId })
      if (+duelId === duelTotalCount - 2)
        //2-nd of 1/2 finals
        updateFighter({ duelId: duelTotalCount, fighterColor: 'Blue', athletId: loserId })
    }

    fillNextRoundByWinners()
    fillDuelFor3rdPlaceByLosers()
  }

  const eventHandlers = { onWinnerChange, onFighterChange }

  const gridByLevels = gridByLevelsFunction(grid)
  return (
    <div style={{ display: 'flex' }}>
      {Object.keys(gridByLevels).map(key => (
        <div key={key} className={classes.levelBox}>
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

const mapStateToProps = state => ({
  participants: state.grid.participants,
  grid: state.grid.grid
})

const mapDispatchToProps = dispatch => ({
  updateFighter: payload => dispatch(updateFighter(payload)),
  setWinner: payload => dispatch(setWinner(payload))
})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Grid)
