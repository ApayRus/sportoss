import React from 'react'
import { map } from 'lodash'
import { CircularProgress } from '@material-ui/core'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import Page from './Page'

function PageFirebaseContainer() {
	const categories = useSelector((state) =>
		map(state.firestore.data.categories, (elem, key) => ({ id: key, ...elem }))
	)
	const { tournaments } = useSelector((state) => state.firestore.ordered)
	const { club } = useSelector((state) => state.firebase.profile)

	useFirestoreConnect(() => {
		return [
			{ collection: 'categories', doc: club, storeAs: 'categories' },
			{ collection: 'tournaments', storeAs: 'tournaments' }
		]
	})

	const loadedProps = {
		categories,
		tournaments
	}

	if (isLoaded(tournaments, categories)) {
		return <Page {...loadedProps} />
	} else {
		return <CircularProgress />
	}
}

export default PageFirebaseContainer
