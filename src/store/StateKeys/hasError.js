import * as KEYS from './keys'
import lodash from 'lodash'

import { actions as Auth } from 'store/auth'
// import { actions as Notification } from 'store/notification'

const SET_HAS_ERROR = 'SET_HAS_ERROR'

export const setHasError = (stateKey, hasError) => ({
  type: 'SET_HAS_ERROR',
  payload: {
    hasError,
    stateKey
  }
})

export const getErrors = (state, stateKey) => {
  return state.hasError[stateKey]
}

function _applyHasError (state, action) {
  const { stateKey, hasError } = action.payload
  return { ...state, [stateKey]: hasError }
}

const ACTION_HANDLERS = {
  [SET_HAS_ERROR]: (state, action) => {
    return _applyHasError(state, action)
  }
}

export const handleApiErrors = (key, error) => (dispatch, getState) => {
  if (!lodash.isEmpty(error)) {
    let { status, data: { message } } = error
    dispatch(setHasError(key, error))
    if (status === 401) {
      dispatch(Auth.logout())
      message = 'Login expired, please login again.'
    }

    dispatch(Notification.emit({
      msg: message,
      visible: true,
      dismissable: true,
      type: 'danger'
    }))
  } else {
    dispatch(setHasError(key, true))
    dispatch(Notification.emit({
      msg: 'Unkown server error occured, please try again later.',
      visible: true,
      dismissable: true,
      type: 'danger'
    }))
  }
}

let initialState = {}
lodash.each(KEYS, (k, v) => {
  if (k !== 'undefined') {
    initialState[k] = false
  }
})

export function hasErrorReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
