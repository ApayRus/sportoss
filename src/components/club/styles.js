const styles = theme => ({
    flexContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
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
    formInfo: {
        position: 'absolute',
        right: 5,
        bottom: 5,

    },
    logo: {
        position: 'absolute',
        right: 5,
        top: 5,
        height: 90
    },
    inputMargin: {
        marginTop: 16,
        marginBottom: 8
    }
})

export default styles