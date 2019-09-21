import React from 'react'
import DuelSimple from './DuelSimple'
import { Typography } from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

function Grid(props) {
  const { grid, classes } = props
  return (
    <div style={{ display: 'inline-block' }}>
      {Object.keys(grid).map(key => (
        <div key={key} className={classes.levelBox}>
          <Typography variant='subtitle1'>{key}-й круг</Typography>
          {grid[key].map(duel => (
            <DuelSimple id={duel.id} key={duel.id} />
          ))}
        </div>
      ))}
    </div>
  )
}

const styles = {
  levelBox: {
    display: 'inline-block',
    marginLeft: 10
    /* border: '1px solid orange', */
    /* width: 250 */
  }
}

export default withStyles(styles)(Grid)
