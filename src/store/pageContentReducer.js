const initState = {
  fromUserId: '', //by whose eyes do you see the app
  athlets: [],
  applications: [],
  categories: [],
  tournaments: [],
  trainers: [],
  activeTabIndex: 0
}

const playerSettingsReducer = (state = initState, action) => {
  switch (action.type) {
    case 'FILL_PAGE_PARAMS': {
      return { ...state, ...action.payload }
    }
    case 'CLEAR_PAGE_PARAMS': {
      return { ...state, ...initState }
    }
    default:
      return state
  }
}

export default playerSettingsReducer
