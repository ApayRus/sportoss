import React from 'react'
import { map } from 'lodash'

import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import ListPage from './GridListPage'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'

export function Page(props) {
	const { tournament, categories, grids } = useSelector(state => state.firestore.data)
	const { applications } = useSelector(state => state.firestore.ordered)
	const { profile } = useSelector(state => state.firebase)
	const allCategories = map(categories, (elem, key) => ({ id: key, ...elem }))

	useFirestoreConnect(() => {
		const { tournamentId } = props.match.params
		return [
			{ collection: 'tournaments', doc: tournamentId, storeAs: 'tournament' },
			{ collection: 'grids', doc: `${tournamentId}`, storeAs: 'grids' },
			{ collection: 'categories', doc: profile.club, storeAs: 'categories' },
			{
				collection: 'applications',
				where: [['tournamentId', '==', tournamentId]],
				storeAs: 'applications'
			}
		]
	})

	const loadedProps = { tournament, allCategories, applications, grids: grids || {}, profile }

	if (isLoaded(allCategories, tournament, applications, grids)) {
		return <ListPage {...loadedProps} />
	} else {
		return <CircularProgress />
	}
}

export default Page
