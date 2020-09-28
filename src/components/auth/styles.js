const styles = theme => ({
    flexContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '90vh'
    },
    loginForm: {
        [theme.breakpoints.up('xs')]: {
            paddingLeft: 5,
            paddingRight: 5,
            padding: 30,
            width: '100%'
        },
        [theme.breakpoints.up('sm')]: {
            width: '80%',
            padding: 30
        },
        [theme.breakpoints.up('md')]: {
            width: '60%'
        },
        position: 'relative'
    },
    loginButton: {
        position: 'absolute',
        right: 5,
        bottom: 5
    },
    inputMargin: {
        marginTop: 16,
        marginBottom: 8
    }
})

export default styles