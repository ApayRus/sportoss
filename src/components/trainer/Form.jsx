import React, { useState, useEffect } from 'react'
import nanoid from 'nanoid'
import { useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
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
	const { userId = '' } = data || {}
	const [formState, setFormState] = useState({
		fullName: '',
		email: '',
		roles: { admin: false, trainer: true },
		id: nanoid(10)
	})
	const [errorMessage, setErrorMessage] = useState()
	const [club] = useSelector(state => state.firestore.ordered.club) || []
	const { profile } = useSelector(state => state.firebase)
	const inviteLink = !userId
		? encodeURI(
				`/register?clubId=${club.id}&clubName=${club.name}&inviterName=${
					profile.fullName
				}&fullName=${formState.fullName}&email=${formState.email}&trainerId=${
					formState.id
				}&roles=${JSON.stringify(formState.roles)}`
		  )
		: ''

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
		firestore
			.set({ collection, doc }, { [formState.id]: formState }, { merge: true })
			.catch(error => {
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
					<Typography style={{ fontSize: 10, wordBrake: 'break-all' }} variant='body2'>
						<a href={inviteLink}>Приглашение на регистрацию</a>
					</Typography>

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
