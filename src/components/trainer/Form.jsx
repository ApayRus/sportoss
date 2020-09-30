import React, { useState, useEffect } from 'react'
import nanoid from 'nanoid'
import { useFirestore } from 'react-redux-firebase'
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
import RoleChecker from './RolesDisplaySelect'

function Form(props) {
	const { isModalOpen, data, closeModal, collection, doc } = props
	const firestore = useFirestore()
	const [formState, setFormState] = useState({
		fullName: '',
		email: '',
		roles: { admin: false, trainer: false }
	})
	const [errorMessage, setErrorMessage] = useState()

	useEffect(() => {
		//component will mount
		if (data) setFormState(data)
		return () => {
			//component will UNmount
		}
	}, [])

	const handleChange = e => {
		setFormState({ ...formState, [e.target.id]: e.target.value })
	}

	const onRoleClick = roleName => event => {
		const newRoleValue = !formState.roles[roleName]
		const newRoles = { ...formState.roles, [roleName]: newRoleValue }
		setFormState({ ...formState, roles: newRoles })
		console.log('formState', formState)
	}

	const handleSubmit = () => {
		//id is empty when we creates new entry, and id is filled when we edit an existent one
		const id = formState.id ? formState.id : nanoid(10)
		firestore.set({ collection, doc }, { [id]: formState }, { merge: true }).catch(error => {
			setErrorMessage(error.message)
		})
		handleCancel()
	}

	const handleCancel = () => {
		closeModal()
	}

	const formTitle = formState.id ? 'Редактирование' : 'Добавление'
	return (
		<div>
			<Dialog open={isModalOpen} onClose={closeModal} aria-labelledby='form-dialog-title'>
				<DialogTitle id='form-dialog-title'>
					<Typography color='primary'>{formTitle} тренера</Typography>
				</DialogTitle>
				<DialogContent>
					<form onChange={handleChange}>
						{/* FULLNAME */}
						<TextField
							id='fullName'
							label='фио'
							type='text'
							value={formState.fullName}
							margin='normal'
							autoFocus
							fullWidth
						/>
						<TextField
							id='email'
							label='email'
							type='text'
							value={formState.email}
							margin='normal'
							autoFocus
							fullWidth
						/>
						<RoleChecker onRoleClick={onRoleClick} roles={formState.roles} />
					</form>
					<br />
					<FormHelperText error> {errorMessage} &nbsp; </FormHelperText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancel} color='default'>
						Отмена
					</Button>
					<Button onClick={handleSubmit} color='primary'>
						Сохранить
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default Form
