import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Select, Typography } from '@material-ui/core'
import { participantsInGrid } from './functionsPlayOff'
import { categoryName, tournamentName } from '../../config/functions'
import GridPlayOff from './GridPlayOff'
import GridAllPlayAll from './GridAllPlayAll'
import TopPlaces from './TopPlaces'
import { setGridParameter, createGrid, createGroups } from '../../store/gridActions'
import Participants from './Participants'
import TopPlacesAllPlayAll from './TopPlacesAllPlayAll'
import GroupTable from './GroupTable'

function Form(props) {
  const {
    tournament,
    category,
    participants,
    gridType,
    grid,
    group1grid,
    group2grid,
    setGridParameter,
    createGrid,
    createGroups,
    groupParticipants
  } = props

  // Set with participants we want to hide in list
  let participantsToHide = new Set()
  //in playOff-grid we want to hide participants who alredy in greed
  if (gridType === 'playOff') {
    participantsToHide = participantsInGrid(grid)
  }
  //in group-grid - hide who alredy in group
  if (gridType === 'group') {
    const alredyInGroups = groupParticipants.flat()
    participantsToHide = new Set(alredyInGroups)
    participantsToHide.delete('')
    participantsToHide.delete(0)
    // console.log('participantsToHide', participantsToHide)
  }

  const participantsParams = { participants, participantsToHide }

  const handleChange = e => {
    const gridType = e.target.value
    setGridParameter({ gridType })
    if (gridType === 'playOff') {
      const participantCount = participants.length
      createGrid({ gridType, participantCount })
    }
    if (gridType === 'allPlayAll') {
      const participantIds = participants.map(elem => elem.athlet.id)
      createGrid({ gridType, participantIds })
    }
    if (gridType === 'group') {
      //const participantIds = participants.map(elem => elem.athlet.id)
      const participantCount = participants.length
      createGroups({ participantCount })
    }
  }

  console.log('participants.length', participants.length)
  /*   const groupsAreFilled = (participants, groupParticipants) => {
    const [group1, group2] = groupParticipants
    return group1
  } */

  return (
    <div>
      <h1>Форма категории</h1>
      <h2>{categoryName(category)}</h2>
      <h3>{tournamentName(tournament)}</h3>
      <Select
        onChange={handleChange}
        native
        inputProps={{
          id: 'gridType'
        }}
      >
        <option value=''></option>
        <option value='playOff'>Олимпийская</option>
        <option value='allPlayAll'>Круговая</option>
        <option value='group'>Групповая</option>
      </Select>

      {/* columns: participants | level-0 | level-1 | ... */}
      {!gridType && <Participants {...participantsParams} />}
      {gridType === 'playOff' && (
        <div style={{ display: 'flex' }}>
          <Participants {...participantsParams} />
          <GridPlayOff />
          <TopPlaces grid={grid} participants={participants} />
        </div>
      )}
      {gridType === 'allPlayAll' && (
        <div style={{ display: 'flex' }}>
          <TopPlacesAllPlayAll grid={grid} participants={participants} />
          <GridAllPlayAll grid={grid} participants={participants} />
        </div>
      )}
      {gridType === 'group' && (
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  {participantsToHide.size !== participants.length && (
                    <Participants {...participantsParams} />
                  )}
                </td>
                <td>
                  <GroupTable
                    groupParticipants={groupParticipants}
                    participants={participants}
                    groupIndex={0}
                  />
                </td>
                <td>
                  <GroupTable
                    groupParticipants={groupParticipants}
                    participants={participants}
                    groupIndex={1}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <GridAllPlayAll grid={group1grid} participants={participants} />
                </td>
                <td>
                  <GridAllPlayAll grid={group2grid} participants={participants} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => {
  const {
    tournament,
    category,
    participants,
    grid,
    gridType,
    groupParticipants,
    group1grid,
    group2grid
  } = state.grid
  return {
    tournament,
    category,
    participants,
    gridType,
    grid,
    group1grid,
    group2grid,
    groupParticipants
  }
}

const mapDispatchToProps = dispatch => ({
  setGridParameter: payload => dispatch(setGridParameter(payload)),
  createGrid: payload => dispatch(createGrid(payload)),
  createGroups: payload => dispatch(createGroups(payload))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)
