import React from 'react'
import { Typography, Container, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import styles from '../auth/styles'

const useStyles = makeStyles(styles)

function ClubView(props) {
	const {
		clubDoc: { name = '', kindOfSport = '', description = '', logo = '', location = '' }
	} = props
	const classes = useStyles()

	return (
		<Container maxWidth='md' className={classes.flexContainer}>
			<Paper className={classes.loginForm}>
				<img style={{ width: 150 }} src={logo} alt='club logo' />
				<Typography>{name}</Typography>
				<Typography>{kindOfSport}</Typography>
				<Typography>{description}</Typography>
				<Typography>{location}</Typography>
			</Paper>
		</Container>
	)
}

export default ClubView
