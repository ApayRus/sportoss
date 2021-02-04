import React, { useState, useEffect } from 'react'

import {
	Button,
	TextField,
	Typography,
	FormHelperText,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle
} from '@material-ui/core'
import CategoryTable from '../layouts/table/Table'
import { categoryName } from '../../config/functions'
import { useSelector } from 'react-redux'

const categoryColumns = [{ id: 'name', numeric: false, disablePadding: true, label: 'Категории' }]

function Form(props) {
	const { categories, isModalOpen, data, closeModal, firestore } = props

	const { fullName, userId } = useSelector(state => state.firebase.profile)

	const [formState, setFormState] = useState({})

	useEffect(() => {
		//component will mount
		setFormState(data)
		return () => {
			//component will UNmount
		}
	}, [])

	const handleChange = field => e => {
		setFormState({ ...formState, [field]: e.target.value })
	}
	const handleSelect = selected => {
		setFormState({ ...formState, categories: selected })
	}

	const handleSubmit = () => {
		// category = { id, gender, minAge, maxAge, weight }
		const createdBy = {
			fullName,
			userId
		}
		//id is empty when we creates new endtry, and filled when we edit an existen one
		if (!formState.id) {
			firestore.add({ collection: 'tournaments' }, { ...formState, createdBy }).catch(error => {
				console.log('firestoreAdd error', error.message)
			})
		} else {
			firestore
				.update({ collection: 'tournaments', doc: formState.id }, { ...formState, createdBy })
				.catch(error => {
					console.log('firestoreUpdate error', error.message)
				})
		}

		handleCancel()
	}

	const handleCancel = () => {
		closeModal()
	}

	const formTitle = formState.id ? 'Редактирование' : 'Добавление'

	const categoriesForTable = categories.map(cat => {
		return { id: cat.id, name: categoryName(cat) }
	})

	return (
		<Dialog open={isModalOpen} onClose={closeModal} aria-labelledby='form-dialog-title'>
			<DialogTitle id='form-dialog-title'>
				<Typography color='primary'>{formTitle} турнира</Typography>
			</DialogTitle>
			<DialogContent>
				<form>
					{/* NAME */}
					<TextField
						onChange={handleChange('name')}
						label='Название'
						type='text'
						value={formState.name}
						margin='normal'
						autoFocus
						fullWidth
						InputLabelProps={{
							shrink: true
						}}
					/>
					<br />
					{/* DATE */}
					<TextField
						onChange={handleChange('date')}
						label='Дата соревнования'
						type='date'
						value={formState.date}
						margin='normal'
						placeholder='yyyy-mm-dd'
						fullWidth
						InputLabelProps={{
							shrink: true
						}}
					/>
					{/* DATE */}
					<TextField
						onChange={handleChange('dateAge')}
						label='Дата определения возраста'
						type='date'
						value={formState.dateAge}
						margin='normal'
						fullWidth
						placeholder='yyyy-mm-dd'
						InputLabelProps={{
							shrink: true
						}}
					/>
					{/* ADDRESS */}
					<TextField
						onChange={handleChange('address')}
						label='Адрес'
						type='text'
						value={formState.address}
						margin='normal'
						fullWidth
						InputLabelProps={{
							shrink: true
						}}
					/>
					<CategoryTable
						data={categoriesForTable}
						columns={categoryColumns}
						collection='categories'
						title='Категории'
						selected={formState.categories}
						handleSelect={handleSelect}
						hideToolbar={true}
					/>
				</form>
				<br />
				<FormHelperText> {/*THIS IS PLACE FOR ERROR MESSAGE */}</FormHelperText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color='primary'>
					Cancel
				</Button>
				<Button onClick={handleSubmit} color='primary'>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default Form
