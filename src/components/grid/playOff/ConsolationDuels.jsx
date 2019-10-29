import React from 'react'
import Duel from '../Duel'
import { Typography as T } from '@material-ui/core'

const styles = {
  consolationBlock: position => ({
    position,
    bottom: 10,
    right: 300
  })
}
/**
 * renders table with consolation duels
 * it's a couple of duels on each tour, except first and final
 * participants are all people who lose from champion and vice-champion
 * @param {object} props
 * @param {number} props.tourCount
 */
function ConsolationDuels(props) {
  const { tourCount, mainDuelCount } = props
  const consolationTourCount = tourCount - 2 //excepted first tour and final
  const columnsRange = new Array(consolationTourCount).fill(0)
  const duelsRow = rowIndex =>
    columnsRange.map((elem, index) => (
      <td key={`consolationDuel-${index}`}>
        <Duel
          duelData={{ id: mainDuelCount + index * 2 + rowIndex, fighterRed: '', fighterBlue: '' }}
          onFighterChange={duelId => event => {}}
          onWinnerChange={duelId => event => {}}
        />
      </td>
    ))

  return (
    <div style={styles.consolationBlock('static')}>
      <T variant='subtitle2' align='center'>
        Утешительные поединки
      </T>
      <table>
        <tbody>
          <tr>{duelsRow(1)}</tr>
          <tr>{duelsRow(2)}</tr>
        </tbody>
      </table>
    </div>
  )
}

export default ConsolationDuels
