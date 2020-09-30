import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button, Hidden, Box } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'
import Drawer from './Drawer'
import BracketCupIcon from './BracketCupIcon'
import { actionTypes } from 'redux-firestore'

const useStyles = makeStyles(theme => {
	return {
		root: {
			flexGrow: 1
		},
		grow: {
			flexGrow: 1
		},
		menuButton: {
			marginLeft: -12,
			marginRight: 20
		}
	}
})

const Navbar = () => {
	const { profile } = useSelector(state => state.firebase)
	const classes = useStyles()
	const firebase = useFirebase()
	const isAuthorized = !profile.isEmpty
	const dispatch = useDispatch()

	const logout = () => {
		firebase.logout()
		dispatch({ type: actionTypes.CLEAR_DATA })
	}

	const menuMap = isAuthorized
		? [
				// admin role:
				{ path: '/club', text: 'Клуб' },
				{ path: '/trainers', text: 'Тренеры' },
				{ path: '/categories', text: 'Категории' },
				{ path: '/tournaments', text: 'Турниры' },

				// trainer role:
				{ path: '/athlets', text: 'Спортсмены' },
				{ path: '/applications', text: 'Заявки' },

				// common:
				{ path: '/', text: 'Выйти', onClick: logout },
				{ path: '#', text: profile.fullName }
		  ]
		: [
				{ path: '/register', text: 'Регистрация' },
				{ path: '/login', text: 'Войти' }
		  ]

	const logo = (
		<Button startIcon={<BracketCupIcon />} component={Link} to='/' color='inherit'>
			Sportoss
		</Button>
	)

	const navLinks = menuMap.map(elem => (
		<Button key={elem.path} component={Link} to={elem.path} onClick={elem.onClick} color='inherit'>
			{elem.text}
		</Button>
	))

	return (
		<div className={classes.root}>
			<Box displayPrint='none'>
				<AppBar position='static'>
					<Toolbar>
						{logo}
						{isAuthorized && (
							<>
								<Hidden smDown>
									<Typography variant='h6' color='inherit' className={classes.grow} />
									{navLinks}
								</Hidden>
								<Hidden mdUp>
									<Typography variant='h6' color='inherit' className={classes.grow} />
									<Drawer menuMap={menuMap} />
								</Hidden>
							</>
						)}
						{!isAuthorized && (
							<>
								<Typography variant='h6' color='inherit' className={classes.grow} />
								{navLinks}
							</>
						)}
					</Toolbar>
				</AppBar>
			</Box>
		</div>
	)
}

export default Navbar
