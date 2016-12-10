import * as actions from './actions'
import * as constants from './constants'

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [constants.LOAD_APP] : (state, action) => ({
    ...state
  }),
  [constants.LOADED_APP] : (state, action) => ({
    ...state
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  title: 'SAP Infrastructure',
  navigationItems: [
    {
      pull: 'left',
      children: [
        {
          link: '/',
          title: 'Dashboard',
          accessLevel: 1
        },
        {
          link: '/servers',
          title: 'Servers',
          accessLevel: 1
        }
      ]
    }
  ]
}

export {
  actions,
  constants
}

export default function appReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
