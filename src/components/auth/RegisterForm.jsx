import React, { useState, useEffect } from 'react'

import {
	Button,
	TextField,
	Input,
	InputLabel,
	Paper,
	Typography,
	FormHelperText,
	InputAdornment,
	IconButton,
	FormControl,
	Container
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import styles from './styles'
import { useHistory, useLocation } from 'react-router-dom'
import InviteMessage from './InviteMessage'

const useStyles = makeStyles(styles)

const RegistrationForm = props => {
	const [state, setState] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
		authError: ''
	})
	const [errorMessage, setErrorMessage] = useState()
	const [showPassword, setShowPassword] = useState()
	const history = useHistory()

	// console.log('useQuery', useQuery())

	const firebase = useFirebase()
	const { authError, auth } = useSelector(state => state.firebase)
	const { message: authErrorMessage = '' } = authError || {}

	const classes = useStyles()

	const locationSearchStringToObject = locationSearchString => {
		const searchParams = new URLSearchParams(locationSearchString)
		const object = {}
		for (var pair of searchParams.entries()) {
			object[pair[0]] = pair[1]
		}
		return object
	}

	const inviteInfo = locationSearchStringToObject(useLocation().search)
	const { fullName, email } = inviteInfo

	useEffect(() => {
		setErrorMessage(authErrorMessage)
	}, [authErrorMessage])

	// for clear errorMessage on switch between register/login
	// else it will go from redux to other component on first open
	useEffect(() => {
		setErrorMessage()
	}, [])
	useEffect(() => {
		setState({ ...state, fullName, email })
	}, [fullName, email])

	const handleChange = e => {
		setErrorMessage()
		setState({ ...state, [e.target.id]: e.target.value })
	}

	const handleSubmit = () => {
		const { email, password, confirmPassword, fullName } = state
		const isPasswordMatch = password === confirmPassword
		isPasswordMatch
			? firebase
					.createUser({ email, password }, { fullName, roles: { admin: true, trainer: false } })
					.then(() => history.push('/club'))
			: setErrorMessage('Passwords do not match')
	}

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleMouseDownPassword = event => {
		event.preventDefault()
	}

	const passwordShowHideButton = (
		<InputAdornment position='end'>
			<IconButton
				aria-label='toggle password visibility'
				onClick={handleClickShowPassword}
				onMouseDown={handleMouseDownPassword}
			>
				{showPassword ? <Visibility /> : <VisibilityOff />}
			</IconButton>
		</InputAdornment>
	)

	if (!auth.isEmpty) return <Redirect to='/' />
	return (
		<Container maxWidth='md' className={classes.flexContainer}>
			<Paper className={classes.loginForm}>
				<Typography variant='h5' color='primary'>
					Регистрация
				</Typography>
				<br />
				<InviteMessage inviteInfo={inviteInfo} />
				<form onChange={handleChange}>
					<TextField
						id='fullName'
						value={state.fullName}
						label='фио'
						type='text'
						margin='normal'
						autoFocus
						fullWidth
					/>
					<br />
					<TextField
						id='email'
						value={state.email}
						label='email'
						type='text'
						margin='normal'
						disabled={email ? true : false}
						fullWidth
					/>
					<br />
					<FormControl className={classes.inputMargin} fullWidth>
						{/* endAdornment with button inside doesn't work with TextField, only with Input  */}
						<InputLabel htmlFor='password'>пароль</InputLabel>
						<Input
							id='password'
							type={showPassword ? 'text' : 'password'}
							endAdornment={passwordShowHideButton}
						/>
					</FormControl>
					<br />
					<TextField
						id='confirmPassword'
						label='подтверждение пароля'
						type={showPassword ? 'text' : 'password'}
						margin='normal'
						fullWidth
					/>
					<br />
					<Button
						className={classes.loginButton}
						onClick={handleSubmit}
						variant='contained'
						color='primary'
						margin='normal'
					>
						Войти
					</Button>
					<FormHelperText error>{errorMessage} &nbsp; </FormHelperText>
					<FormHelperText className={classes.inviteToLoginRegister}>
						Уже зарегистрированы? Тогда <Link to='/login'>войдите</Link>.
					</FormHelperText>
				</form>
			</Paper>
		</Container>
	)
}

export default RegistrationForm
