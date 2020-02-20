import React from 'react'
import Duel from '../Duel'
import { Typography as T } from '@material-ui/core'
import { useSelector } from 'react-redux'

function GroupFinal(props) {
  const { group1grid, group2grid } = useSelector(state => state.grid)
  const finalDuelNum = Object.keys(group1grid).length + Object.keys(group2grid).length
  return (
    <div style={{ display: 'inline-block' }}>
      <div>
        <T variant='subtitle2' align='center'>
          Финал
        </T>
      </div>
      <div>
        <Duel
          duelData={{ id: finalDuelNum + 1, fighterRed: '', fighterBlue: '' }}
          onFighterChange={duelId => event => {}}
          onWinnerChange={duelId => event => {}}
          showScoreInput={true}
        />
      </div>
    </div>
  )
}

export default GroupFinal
