import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button, Hidden, Box } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'
import Drawer from './Drawer'
import BracketCupIcon from './BracketCupIcon'

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

	const menuMap = isAuthorized
		? [
				{ path: '/athlets', text: 'Спортсмены' },
				{ path: '/trainers', text: 'Тренеры' },
				{ path: '/tournaments', text: 'Турниры' },
				{ path: '/categories', text: 'Категории' },
				{ path: '/applications', text: 'Заявки' },
				{ path: '/', text: 'Выйти', onClick: firebase.logout },
				{ path: '#', text: profile.userName }
		  ]
		: [{ path: '/login', text: 'Войти' }]

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
						<Hidden xsDown>
							<Typography variant='h6' color='inherit' className={classes.grow} />
							{navLinks}
						</Hidden>
						<Hidden smUp>
							<Typography variant='h6' color='inherit' className={classes.grow} />
							<Drawer menuMap={menuMap} />
						</Hidden>
					</Toolbar>
				</AppBar>
			</Box>
		</div>
	)
}

export default Navbar
