import React from 'react'
import DuelSimple from './DuelSimple'
import { Typography } from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

function Grid(props) {
  const { grid, classes } = props
  return (
    <div style={{ display: 'flex' }}>
      {Object.keys(grid).map(key => (
        <div key={key} className={classes.levelBox}>
          {grid[key].map(duel => (
            <div className={classes.duel}>
              <DuelSimple id={duel.id} key={duel.id} />
            </div>
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
    /* border: '1px solid orange', */
    /* width: 250 */
  },
  duel: {
    /* flex: 1 */
  }
}

export default withStyles(styles)(Grid)
