import React from 'react'
import Duel from '../Duel'
import { useSelector } from 'react-redux'
import { Typography as T } from '@material-ui/core'
import { map, groupBy } from 'lodash'

const styles = {
  consolationBlock: position => ({
    position,
    bottom: 3,
    right: 350,
    display: 'inline-block'
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
  const { position } = props
  const { grid, participants } = useSelector(state => state.grid)
  const finalId = participants.length - 1
  const gridArray = map(grid, (elem, key) => ({ id: key, ...elem }))
  const consolationDuels = gridArray.filter(elem => elem.id > finalId)

  let consolationDuelsByLevel = groupBy(consolationDuels, 'level')
  //sometimes we need fake duels for take empty place
  const firstConsolationTour = consolationDuelsByLevel['con1']
  if (
    firstConsolationTour &&
    firstConsolationTour.length === 1 &&
    firstConsolationTour[0].next - Number(firstConsolationTour[0].id) === 1
  ) {
    const fakeDuel = { id: 0, status: 'fake' }
    firstConsolationTour.unshift(fakeDuel)
  }

  return (
    <div style={styles.consolationBlock(position)}>
      <div>
        <T variant='subtitle2' align='center'>
          Утешительные поединки
        </T>
      </div>
      <div style={{ marginTop: 4 }}>
        {Object.keys(consolationDuelsByLevel).map(level => (
          <div key={level} style={{ display: 'inline-block', marginRight: 15 }}>
            {consolationDuelsByLevel[level].map(duel => (
              <Duel
                duelData={duel}
                participants={participants}
                key={duel.id}
                showWinnerCheckbox={true}
                onFighterChange={() => {}}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConsolationDuels
