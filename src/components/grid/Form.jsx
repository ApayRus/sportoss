import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { Select, Button, Typography, Box } from '@material-ui/core'
import { participantsInGrid, gridInfo } from './playOff/functionsPlayOff'
import { categoryName, tournamentName } from '../../config/functions'
import GridPlayOff from './playOff/GridPlayOff'
import ConsolationDuels from './playOff/ConsolationDuels'
import GridAllPlayAll from './playAlltoAll/GridAllPlayAll'
import { setGridParameter, createGrid, createGroups, clearGrid } from '../../store/gridActions'
// import TopPlaces from './TopPlaces'
// import TopPlacesAllPlayAll from './TopPlacesAllPlayAll'
import Participants from './Participants'
import GroupTable from './GroupTable'
import Result from './Result'
import { makeStyles, useMediaQuery } from '@material-ui/core'

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
    clearGrid,
    createGroups,
    groupParticipants
  } = props

  const isForPrintView = useMediaQuery('print')

  const useStyles = makeStyles(theme => ({
    page: {
      backgroundImage: `url("/wkf-logo.png")`,
      backgroundPosition: 'top 0px right 30px',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 100,
      position: 'relative',
      margin: 20
    }
  }))

  const classes = useStyles()

  // Set with participants we want to hide in list
  let participantsToHide = new Set()
  //in playOff-grid we want to hide participants who alredy in greed
  if (gridType === 'playOff') {
    participantsToHide = participantsInGrid(grid)
    participantsToHide.delete(undefined)
    participantsToHide.delete('')
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

  useEffect(() => {
    //component will mount
    return () => {
      //component will UNmount
      clearGrid()
    }
  }, [])

  console.log(
    'participantsToHide.size, participants.length',
    participantsToHide.size,
    participants.length
  )
  console.log('participantsToHide', participantsToHide)
  return (
    <div className={classes.page}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant='h5'>{`${tournamentName(tournament)}`}</Typography>
        <Typography variant='h6'>{categoryName(category)}</Typography>
      </div>
      <Box displayPrint='none'>
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
      </Box>

      {/* columns: participants | level-0 | level-1 | ... */}
      {!gridType && <Participants {...participantsParams} />}
      {gridType === 'playOff' && (
        <div>
          <div style={{ display: 'flex' }}>
            {participantsToHide.size !== participants.length && (
              <Participants {...participantsParams} />
            )}
            <GridPlayOff />
            {/* <TopPlaces grid={grid} participants={participants} /> */}
            {/* gridInfo = {tourCount, mainDuelCount} */}
          </div>
          <ConsolationDuels {...gridInfo(grid)} position={isForPrintView ? 'fixed' : 'static'} />
          <Result />
        </div>
      )}
      {gridType === 'allPlayAll' && (
        <Fragment>
          {/* <TopPlacesAllPlayAll grid={grid} participants={participants} /> */}
          <GridAllPlayAll grid={grid} participants={participants} />
          <Result />
        </Fragment>
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
                <td></td>
                <td style={{ textAlign: 'right' }}>
                  <Box displayPrint='none'>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => createGrid({ gridType: 'group' })}
                    >
                      Обновить поединки
                    </Button>
                  </Box>
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
          <Result />
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
  clearGrid: () => dispatch(clearGrid()),
  createGroups: payload => dispatch(createGroups(payload))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form)
