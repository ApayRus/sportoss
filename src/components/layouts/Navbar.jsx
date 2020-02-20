import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button, Hidden, Box } from '@material-ui/core'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import Drawer from './Drawer'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'

const styles = {
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

const Navbar = props => {
  const { classes, auth, profile } = props
  const links = auth.uid ? (
    <SignedInLinks profile={profile} email={auth.email} signOut={props.firebase.logout} />
  ) : (
    <SignedOutLinks />
  )
  return (
    <div className={classes.root}>
      <Box displayPrint='none'>
        <AppBar position='static'>
          <Toolbar>
            <Hidden smUp>
              <Drawer authLinks={links} />
            </Hidden>
            <Hidden xsDown>
              <Typography variant='h6' color='inherit' className={classes.grow} />
              <Button component={Link} to='/athlets' color='inherit'>
                Спортсмены
              </Button>
              <Button component={Link} to='/trainers' color='inherit'>
                Тренеры
              </Button>
              <Button component={Link} to='/tournaments' color='inherit'>
                Турниры
              </Button>
              <Button component={Link} to='/categories' color='inherit'>
                Категории
              </Button>
              <Button component={Link} to='/applications' color='inherit'>
                Заявки
              </Button>
              {links}
            </Hidden>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
}

const mapStateToProps = state => {
  return { auth: state.firebase.auth, profile: state.firebase.profile }
}

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
  withStyles(styles)
)(Navbar)