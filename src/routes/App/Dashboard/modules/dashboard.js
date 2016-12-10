import { Api } from 'middleware/api'
import log from 'middleware/logger'

import _ from 'lodash'

import { KEYS, setHasError, setIsLoading, setHasResults, handleApiErrors } from 'store/StateKeys'

// ------------------------------------
// Constants
// ------------------------------------
const LOAD_DASHBOARD_DATA = 'LOAD_DASHBOARD_DATA'
const LOADED_DASHBOARD_DATA = 'LOADED_DASHBOARD_DATA'

// ------------------------------------
// Actions
// ------------------------------------

const _load = (payload = {}) => ({
  type: LOAD_DASHBOARD_DATA,
  payload
})

const _loaded = (payload = {}) => ({
  type: LOADED_DASHBOARD_DATA,
  payload
})

// export const doubleAsync = () => {
//   return (dispatch, getState) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         dispatch(increment(getState().counter))
//         resolve()
//       }, 200)
//     })
//   }
// }
const load = (payload) => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      dispatch(_load())
      log.debug('Dashboard::load::initial')
      dispatch(setIsLoading(KEYS.DASHBOARD, true))
      Api.get('/dashboard/load', { auth: true })
      .then((response) => {
        log.debug('Dashboard::load::success', response)
        return response
      })
      .then(({ data }) => {
        dispatch(setIsLoading(KEYS.DASHBOARD, false))
        dispatch(setHasResults(KEYS.DASHBOARD, (!_.isEmpty(data.data) && !_.isEmpty(data.data))))
        dispatch(_loaded({ ...data.data }))
      })
      .catch((error) => {
        log.error(error)
        // dispatch(setIsLoading(KEYS., false))
        dispatch(handleApiErrors(KEYS.DASHBOARD, error))
        // dispatch(authLoginFailure(error))
      })
    })
  }
}

export const actions = {
  load
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOAD_DASHBOARD_DATA] : (state, action) => {
    return state
  },
  [LOADED_DASHBOARD_DATA]: (state, action) => ({
    ...state,
    ...action.payload
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  connagents: [],
  disconagents: [],
  groupbycomponent: [],
  groupbylocation: [],
  groupbytier: [],
  outofsync: []
}
export default function dashboardReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
