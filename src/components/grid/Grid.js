import React from 'react'
import DuelSimple from './Duel'

import { withStyles } from '@material-ui/core/styles'

function Grid(props) {
  const { grid, classes } = props
  return (
    <div style={{ display: 'flex' }}>
      {Object.keys(grid).map(key => (
        <div key={key} className={classes.levelBox}>
          {grid[key].map(duel => (
            <DuelSimple duelData={duel} key={duel.id} />
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

export default withStyles(styles)(Grid)
