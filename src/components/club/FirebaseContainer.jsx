import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase'
import Page from './Page'

export function ClubFirebaseContainer(props) {
	const { profile } = useSelector(state => state.firebase)
	const { club: clubDoc } = useSelector(state => state.firestore.ordered)
	const { club = '' } = profile

	if (isLoaded(clubDoc, profile)) {
		const loadedProps = { clubDoc: club ? clubDoc[0] : null, profile }
		return <Page {...loadedProps} />
	} else {
		return <CircularProgress />
	}
}

export default ClubFirebaseContainer
