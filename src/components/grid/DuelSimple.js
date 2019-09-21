import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  duel: {
    width: 200,
    /*     height: 20, */
    border: '1px solid gray',
    borderRadius: 5,
    marginBottom: 5
  },
  duelNumber: {
    minWidth: 30,
    borderRight: '1px solid gray',
    textAlign: 'center',
    color: 'slategray'
  },
  athletRed: { width: 137, borderBottom: '1px solid gray' },
  athletBlue: { width: 137 },
  athletInput: { width: '100%', border: 'none' },
  winnerRed: { borderBottom: '1px solid gray' }
}

function DuelSimple(props) {
  const { id, classes } = props
  return (
    <table className={classes.duel}>
      <tr>
        <td className={classes.duelNumber} rowspan='2'>
          {id}
        </td>
        <td className={classes.athletRed}>
          <input type='text' placeholder='red' className={classes.athletInput} />
        </td>
        <td className={classes.winnerRed}>
          <input type='checkbox' />
        </td>
      </tr>
      <tr>
        <td className={classes.athletBlue}>
          <input type='text' placeholder='blue' className={classes.athletInput} />
        </td>
        <td className={classes.winnerBlue}>
          <input type='checkbox' />
        </td>
      </tr>
    </table>
  )
}

export default withStyles(styles)(DuelSimple)
