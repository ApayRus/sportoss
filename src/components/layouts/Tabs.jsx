import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  tab: {
    minWidth: 100
  }
}))

export default function ScrollableTabsButtonAuto(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const { tabs, activeTabIndex } = props

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  React.useEffect(() => {
    setValue(activeTabIndex)
  }, [])

  return (
    <div className={classes.root}>
      <AppBar position='static' color='default'>
        <Tabs
          defaultValue
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
          aria-label='scrollable auto tabs example'
        >
          {tabs.map((elem, index) => (
            <Tab
              key={`tab-${index}`}
              onClick={props.onTabClick(elem.userId)}
              label={`${elem.familyName} ${elem.firstName[0]}.${elem.fatherName[0]}`}
              {...a11yProps(index)}
              className={classes.tab}
            />
          ))}
        </Tabs>
      </AppBar>
    </div>
  )
}
