import React, { Fragment } from 'react'
import { Button } from '@material-ui/core'

const SignedInLinks = props => {
  const { profile, signOut } = props
  const { userName = '' } = profile
  return (
    <Fragment>
      <Button onClick={signOut} color='inherit'>
        Выйти
      </Button>
      <Button color='inherit'>{userName}</Button>
    </Fragment>
  )
}

export default SignedInLinks
