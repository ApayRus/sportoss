import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import { Typography as T } from '@material-ui/core'
import { EmojiEvents as CupIcon } from '@material-ui/icons'

function TopPlaces(props) {
  const { classes } = props
  const rows = [
    { number: 1, color: 'gold' },
    { number: 2, color: 'silver' },
    { number: 3, color: '#cd7f32' },
    { number: 3, color: '#cd7f32' }
  ]
  return (
    <div className={classes.resultBox}>
      <T variant='h6' align='center'>
        Итог
      </T>
      <table className={classes.resultTable}>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`resultRow-${index}`}>
              <td className={`${classes.number} ${classes.td}`}>
                <T variant='body2'>{row.number}</T>
              </td>
              <td className={`${classes.td}`}>
                <CupIcon style={{ color: row.color }} />
              </td>
              <td className={`${classes.td} ${classes.athlet}`}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  resultBox: {
    position: 'fixed',
    right: 10,
    bottom: 10,
    width: 250,
    border: '1px solid gray',
    borderRadius: 5
  },
  resultTable: {
    borderCollapse: 'collapse'
  },
  number: { width: 10, padding: 5, color: 'slategray' },
  td: { borderBottom: '1px solid gray' },
  athlet: { width: '100%' }
}

export default withStyles(styles)(TopPlaces)
