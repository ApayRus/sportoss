import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { List, ListItem, ListItemText, SwipeableDrawer, IconButton } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Menu as MenuIcon } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
	list: {
		width: 250
	},
	fullList: {
		width: 'auto'
	}
}))

const SwipeableTemporaryDrawer = props => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleDrawer = () => setIsOpen(!isOpen)

	const { menuMap } = props
	const classes = useStyles()

	const sideList = (
		<div className={classes.list}>
			<List>
				{menuMap.map(elem => (
					<ListItem button component={Link} to={elem.path} key={elem.path} onClick={elem.onClick}>
						<ListItemText primary={elem.text} />
					</ListItem>
				))}
			</List>
		</div>
	)

	return (
		<div>
			<IconButton
				className={classes.menuButton}
				color='inherit'
				aria-label='Menu'
				onClick={toggleDrawer}
			>
				<MenuIcon />
			</IconButton>

			<SwipeableDrawer anchor='right' open={isOpen} onClose={toggleDrawer} onOpen={toggleDrawer}>
				<div tabIndex={0} role='button' onClick={toggleDrawer} onKeyDown={toggleDrawer}>
					{sideList}
				</div>
			</SwipeableDrawer>
		</div>
	)
}

export default SwipeableTemporaryDrawer
