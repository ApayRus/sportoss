import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import Page from './Page'

export function ClubFirebaseContainer(props) {
	const { profile } = useSelector(state => state.firebase)
	const { club: clubDoc } = useSelector(state => state.firestore.ordered)
	const { club } = profile
	useFirestoreConnect([{ collection: 'clubs', doc: club, storeAs: 'club' }])

	if (isLoaded(clubDoc, profile)) {
		const loadedProps = { clubDoc: clubDoc[0], profile }
		return <Page {...loadedProps} />
	} else {
		return <CircularProgress />
	}
}

export default ClubFirebaseContainer
