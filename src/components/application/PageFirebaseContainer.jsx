import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { fillPageParams } from '../../store/pageContentActions'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { map } from 'lodash'
import ApplicationsTable from './Page'
import Tabs from '../layouts/Tabs'

/**
 *
 * this component is used in multi-user mode (when profile.roles.admin == true)
 * we can open applications and even create them for other users (fromUserId)
 * while {create, update} can be adminId but they still should correspond to this user (fromUserId)
 */
export function PageFirebaseContainer(props) {
  const { tournaments } = useSelector(state => state.firestore.ordered)
  const { fromUserId, trainers, activeTabIndex } = useSelector(state => state.pageContent)
  const { categories: categoriesDoc, trainers: trainersDoc } = useSelector(
    state => state.firestore.data
  )
  const athletesDoc = useSelector(state => state.firestore.data['athletes' + fromUserId])
  const applicationsDoc = useSelector(state => state.firestore.data['applications' + fromUserId])

  const { profile } = useSelector(state => state.firebase)
  const { club = '' } = profile
  const dispatch = useDispatch()

  useFirestoreConnect(props => {
    if (fromUserId) {
      // const userFilter = props.isAdmin ? {} : { where: [['createdBy.userId', '==', props.userId]] }
      const userFilter = { where: [['fromUserId', '==', fromUserId]] }
      const load = [
        { collection: 'athletes', doc: fromUserId, storeAs: 'athletes' + fromUserId },
        { collection: 'applications', ...userFilter, storeAs: 'applications' + fromUserId },
        { collection: 'categories', doc: club, storeAs: 'categories' },
        { collection: 'tournaments', storeAs: 'tournaments' }
      ]
      if (profile.userId && profile.roles.admin)
        load.push({ collection: 'trainers', doc: club, storeAs: 'trainers' })
      return load
    } else return []
  })

  const [isLoadedTableData, setIsLoadedTableData] = useState(false)
  const [isLoadedTrainersInfo, setIsLoadedTrainersInfo] = useState(false)

  const onTabClick = fromUserId => event => {
    dispatch(fillPageParams({ fromUserId }))
    setIsLoadedTableData(false)
  }

  //first we need profile and trainers to know admin rights, to show all trainers tabs or not
  useEffect(() => {
    if (isLoaded(profile)) {
      //on first load we use userId from profile. but when user clicks Tab, userId will be changed
      dispatch(fillPageParams({ fromUserId: profile.userId }))
    }
    if (isLoaded(trainersDoc, profile)) {
      const trainers = map(trainersDoc, (elem, key) => ({ ...elem, id: key }))
      const activeTabIndex = trainers.findIndex(elem => elem.userId === profile.userId) //on first open
      dispatch(fillPageParams({ trainers, activeTabIndex }))
      setIsLoadedTrainersInfo(true)
    }
  }, [profile, trainersDoc])

  //when main set of data is loaded we can show ApplicationsTable
  useEffect(() => {
    if (isLoaded(athletesDoc, applicationsDoc, categoriesDoc, tournaments)) {
      const applications = map(applicationsDoc, (elem, key) => ({ ...elem, id: key }))
      const categories = map(categoriesDoc, (elem, key) => ({ ...elem, id: key }))
      const athlets = map(athletesDoc, (elem, key) => ({ ...elem, id: key })).filter(
        elem => elem.id !== 'club'
      )
      dispatch(fillPageParams({ applications, categories, athlets, tournaments }))
      setIsLoadedTableData(true)
    }
  }, [athletesDoc, applicationsDoc, categoriesDoc, tournaments])

  //when we close page, we clear state
  useEffect(() => {
    return () => {
      dispatch(fillPageParams({ fromUserId: '' }))
    }
  }, [])

  return (
    <div>
      {isLoadedTrainersInfo && profile.userId && profile.roles.admin && (
        <Tabs tabs={trainers} activeTabIndex={activeTabIndex} onTabClick={onTabClick} />
      )}
      {isLoadedTableData ? <ApplicationsTable /> : <CircularProgress />}
    </div>
  )
}

export default PageFirebaseContainer
