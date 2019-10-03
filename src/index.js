import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import * as serviceWorker from './serviceWorker'
import Router from './App'
import { rrfProps } from './firebase/reactReduxFirebase'
import store from './store/rootReducer'

// Setup react-redux so that connect HOC can be used

render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Router />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
