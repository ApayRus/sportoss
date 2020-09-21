import React, { useState } from 'react'
import { Fab, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import GridIcon from '@material-ui/icons/GridOn'
import PeopleIcon from '@material-ui/icons/People'
import { Link } from 'react-router-dom'
import { useFirestore } from 'react-redux-firebase'

import Table from '../layouts/table/Table'
import Form from './Form'

//Table columns or fields of our data model
const columns = [
	{ id: 'name', numeric: false, disablePadding: false, label: 'Название' },
	{ id: 'date', numeric: false, disablePadding: false, label: 'Дата' },
	{ id: 'address', numeric: false, disablePadding: false, label: 'Место' },
	{ id: 'grids', numeric: false, disablePadding: false, label: 'Сетки' },
	{ id: 'participants', numeric: false, disablePadding: false, label: 'Участники' },
	{ id: 'id', numeric: false, disablePadding: false, label: 'id' }
]

const fabStyle = {
	margin: 0,
	top: 'auto',
	right: 20,
	bottom: 20,
	left: 'auto',
	position: 'fixed'
}

function Page(props) {
	const { categories, tournaments } = props
	const [isModalOpen, setModalOpen] = useState(false)
	const [modalData, setModalData] = useState({})
	const firestore = useFirestore()

	const openModal = (id) => {
		const defaultFormData = { name: '', date: '', dateAge: '', address: '', categories: [] }
		const modalData = tournaments.find((el) => el.id === id) || defaultFormData
		setModalData(modalData)
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
	}

	let extendedTournaments = []

	const gridsLink = (tournamentId) => (
		<IconButton component={Link} to={`/tournaments/${tournamentId}/grids/`}>
			<GridIcon />
		</IconButton>
	)

	const participantsLink = (tournamentId) => (
		<IconButton component={Link} to={`/tournaments/${tournamentId}/participants/`}>
			<PeopleIcon />
		</IconButton>
	)

	extendedTournaments = tournaments.map((tournament) => {
		const grids = gridsLink(tournament.id)
		const participants = participantsLink(tournament.id)
		return { ...tournament, grids, participants }
	})

	return (
		<main>
			<Table
				data={extendedTournaments}
				showToolbarButtons={{ edit: true, clone: true }}
				// handleSelected={this.getSelected}
				openModal={openModal}
				firestoreDelete={firestore.delete}
				columns={columns}
				collection='tournaments'
				title='Турниры'
			/>
			<Fab style={fabStyle} onClick={() => openModal(null)} color='primary' aria-label='Add'>
				<AddIcon />
			</Fab>
			{isModalOpen && (
				<Form
					isModalOpen={isModalOpen}
					data={modalData}
					closeModal={closeModal}
					categories={categories}
					firestore={firestore}
				/>
			)}
		</main>
	)
}

export default Page
