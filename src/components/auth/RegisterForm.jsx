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

const useStyles = makeStyles(styles)

const RegistrationForm = props => {
	const [state, setState] = useState({ email: '', password: '', fullName: '', authError: '' })
	const [errorMessage, setErrorMessage] = useState()
	const [showPassword, setShowPassword] = useState()

	const firebase = useFirebase()
	const { authError, auth } = useSelector(state => state.firebase)
	const { message: authErrorMessage = '' } = authError || {}

	const classes = useStyles()

	useEffect(() => {
		setErrorMessage(authErrorMessage)
	}, [authErrorMessage])

	// for clear errorMessage on switch between register/login
	// else it will go from redux to other component on first open
	useEffect(() => {
		setErrorMessage()
	}, [])

	const handleChange = e => {
		setErrorMessage()
		setState({ ...state, [e.target.id]: e.target.value })
	}

	const handleSubmit = () => {
		const { email, password, confirmPassword, fullName } = state
		const isPasswordMatch = password === confirmPassword
		isPasswordMatch
			? firebase.createUser({ email, password }, { fullName, roles: { admin: true } })
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
				<Typography variant='body2' color='primary'>
					<span style={{ color: 'red' }}>Внимание! </span>
					Регистрируйтесь через эту форму только если хотите создать новый клуб. Если ваш клуб уже
					зарегистрирован и вы хотите присоединиться к нему, свяжитесь с админом клуба чтобы он
					прислал вам на почту ссылку - приглашение для регистрации.
				</Typography>
				<form onChange={handleChange}>
					<TextField id='fullName' label='фио' type='text' margin='normal' autoFocus fullWidth />
					<br />
					<TextField id='email' label='email' type='text' margin='normal' fullWidth />
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
					<FormHelperText error>{errorMessage}</FormHelperText>
					<FormHelperText>
						Уже зарегистрированы? Тогда <Link to='/login'>войдите</Link>.
					</FormHelperText>
				</form>
			</Paper>
		</Container>
	)
}

export default RegistrationForm
