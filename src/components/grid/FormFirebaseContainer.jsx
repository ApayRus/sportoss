import React, { useEffect, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { CircularProgress } from '@material-ui/core'
import { participantsGroupedByCategories } from '../../dataFunctions'
import { sortParticipantsByTrainerFrequency } from './functions'

import { map, find } from 'lodash'
import { trainerColors } from '../../config/functions'
import { setGridParameter } from '../../store/gridActions'
import { participantsInGrid } from './playOff/functionsPlayOff'
import Form from './Form'

function FormFirebaseContainer(props) {
  const { categoryId, tournamentId, club } = props.match.params
  const { profile } = useSelector(state => state.firebase)
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false)
  const dispatch = useDispatch()

  useFirestoreConnect(() => [
    { collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
    { collection: 'categories', doc: club, storeAs: 'categories' },
    { collection: 'trainers', doc: club, storeAs: 'trainers' },
    { collection: 'grids', doc: `${tournamentId}`, storeAs: 'grids' },
    { collection: 'applications', where: [['tournamentId', '==', tournamentId]] },
    { collection: 'athletes', where: [['club', '==', club]], storeAs: 'allAthletes' }
  ])

  const { tournament, categories, grids, trainers, allAthletes } = useSelector(
    state => state.firestore.data
  )
  const { applications } = useSelector(state => state.firestore.ordered)

  let participants = []

  const setGridInfo = (participants, tournament, tournamentId, categories, categoryId, grids) => {
    const category = categories[categoryId]
    dispatch(setGridParameter({ participants }))
    dispatch(setGridParameter({ tournament }))
    dispatch(setGridParameter({ category }))
    dispatch(setGridParameter({ categoryId }))
    dispatch(setGridParameter({ tournamentId }))
    if (grids && grids[categoryId]) {
      const { gridType } = grids[categoryId]
      dispatch(setGridParameter({ gridType }))
      if (gridType === 'group') {
        const fillGroupGrid = () => {
          const { group1grid, group2grid } = grids[categoryId]
          dispatch(setGridParameter({ group1grid }))
          dispatch(setGridParameter({ group2grid }))
          dispatch(
            setGridParameter({
              groupParticipants: [
                [...participantsInGrid(group1grid)],
                [...participantsInGrid(group2grid)]
              ]
            })
          )
        }
        fillGroupGrid()
      } else {
        dispatch(setGridParameter({ grid: grids[categoryId]['grid'] }))
      }
    }
  }

  useEffect(() => {
    if (isLoaded(tournament, categories, applications, allAthletes, trainers, profile, grids)) {
      participants = participantsGroupedByCategories(applications)[categoryId]
      participants = sortParticipantsByTrainerFrequency(participants)
      let allAthlets = map(allAthletes, oneTrainerAthletes =>
        map(oneTrainerAthletes, (elem, key) => ({ id: key, ...elem }))
      )
      allAthlets = allAthlets.flat()
      allAthlets = allAthlets.filter(elem => elem.id !== 'club')

      const allTrainers = map(trainers, (elem, key) => ({ ...elem, id: key })) || []
      const trainerColorMap = trainerColors(participants)
      participants = map(participants).map(elem => {
        const athlet = find(allAthlets, { id: elem.athletId })
        let trainer = find(allTrainers, { id: elem.trainerId })
        const trainerColor = trainer ? trainerColorMap[trainer.id] : 'white'
        trainer = { ...trainer, color: trainerColor }
        return { athlet, trainer }
      })
      setGridInfo(participants, tournament, tournamentId, categories, categoryId, grids)
      setIsAllDataLoaded(true)
    }
    return () => {
      // cleanup
    }
  }, [tournament, categories, applications, allAthletes, trainers, profile, grids])

  return isAllDataLoaded ? <Form /> : <CircularProgress />
}

export default FormFirebaseContainer
