import React from 'react'
import { filter, sortBy } from 'lodash'
import { athletName } from '../../config/functions'

import { withStyles } from '@material-ui/core/styles'

function TopPlacesAllPlayAll(props) {
  const { grid, classes, participants } = props

  let resultTable = participants.map(elem => {
    const wins = filter(grid, { winner: elem.athlet.id }).length
    return { ...elem, wins }
  })

  resultTable = sortBy(resultTable, 'wins').reverse()
  return (
    <div className={classes.levelBox}>
      <table className={classes.resultTable}>
        <tbody>
          {resultTable.map(elem => (
            <tr key={`place-in-table-${elem.athlet.id}`}>
              <td>{athletName(elem.athlet)}</td>
              <td className={classes.number}>{elem.wins}</td>
            </tr>
          ))}
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

export default withStyles(styles)(TopPlacesAllPlayAll)
