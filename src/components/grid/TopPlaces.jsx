import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import { Typography as T } from '@material-ui/core'
import { EmojiEvents as CupIcon } from '@material-ui/icons'
import { find } from 'lodash'
import { athletName } from '../../config/functions'

function TopPlaces(props) {
  const { grid, participants, classes } = props
  let gold, silver, bronze
  const duelTotalCount = Object.keys(grid).length

  //final result
  const duelFinal = grid[duelTotalCount - 1]
  if (duelFinal) {
    if (duelFinal.winner) {
      const { fighterRed, fighterBlue, winner } = duelFinal
      const loser = winner === fighterRed ? fighterBlue : fighterRed
      gold = find(participants, { athlet: { id: winner } }).athlet
      silver = find(participants, { athlet: { id: loser } }).athlet
    }
    //3rd place result
    const duelFor3rdPlace = grid[duelTotalCount]
    if (duelFor3rdPlace.winner) {
      const { winner: bronzeWinner } = duelFor3rdPlace
      bronze = find(participants, { athlet: { id: bronzeWinner } }).athlet
    }
  }

  return (
    <div className={classes.levelBox}>
      <table className={classes.resultTable}>
        <tbody>
          <tr>
            <td className={classes.number}>
              <T variant='body2'>1</T>
            </td>
            <td>
              <CupIcon style={{ color: 'gold' }} />
            </td>
            <td>
              <T variant='body2'>{athletName(gold)}</T>
            </td>
          </tr>
          <tr>
            <td className={classes.number}>
              <T variant='body2'>2</T>
            </td>
            <td>
              <CupIcon style={{ color: 'silver' }} />
            </td>
            <td>
              <T variant='body2'>{athletName(silver)}</T>
            </td>
          </tr>
          <tr>
            <td className={classes.number}>
              <T variant='body2'>3</T>
            </td>
            <td>
              <CupIcon style={{ color: '#cd7f32' }} />
            </td>
            <td>
              <T variant='body2'>{athletName(bronze)}</T>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  levelBox: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center'
  },
  resultTable: {
    width: 250,
    border: '1px solid gray',
    borderRadius: 5
  },
  number: { width: 10, padding: 5, color: 'slategray' }
}

export default withStyles(styles)(TopPlaces)
