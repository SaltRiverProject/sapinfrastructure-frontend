import { browserHistory } from 'react-router'
import jwtDecode from 'jwt-decode'
import log from 'middleware/logger'
import { isEmpty } from 'lodash'

import { Api } from 'middleware/api'
import { KEYS, setHasError, setIsLoading, setHasResults, handleApiErrors } from './StateKeys'

// import { actions as Notification } from 'store/notification'

// const User = new Record({
//   firstName: 'John',
//   lastName: 'Doe',
//   groups: new Map(),
//   email: null,
//   accountType: 'local',
//   photo: 'http://lorempixel.com/100/100/',
//   username: 'jdoe',
//   createdAt: null,
//   updatedAt: null,
//   id: null
// })

const initialState = {
  isAuthenticated: false,
  resetPassword: false,
  errors: [],
  user: {}
}

// ------------------------------------
// Constants
// ------------------------------------
export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST'
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS'
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE'
export const AUTH_LOGOUT_REQUEST = 'AUTH_LOGOUT_REQUEST'
export const AUTH_LOGOUT_SUCCESS = 'AUTH_LOGOUT_SUCCESS'
export const AUTH_NOT_LOGGED_IN = 'AUTH_NOT_LOGGED_IN'

// ------------------------------------
// Actions
// ------------------------------------
export function authLogoutRequest () {
  return {
    type: AUTH_LOGOUT_REQUEST
  }
}
export function authLogoutSuccess () {
  return {
    type: AUTH_LOGOUT_SUCCESS
  }
}
export function authLoginRequest (payload) {
  return {
    type: AUTH_LOGIN_REQUEST,
    payload
  }
}
export function authLoginSuccess (payload) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    payload
  }
}
export function authLoginFailure (payload) {
  return {
    type: AUTH_LOGIN_FAILURE,
    payload
  }
}

export function authNotLoggedIn (payload) {
  return {
    type: AUTH_NOT_LOGGED_IN,
    payload
  }
}

export function decodeToken (token) {
  if (token || token !== 'undefined') {
    return jwtDecode(token)
  }
}

export function getUser () {
  return localStorage.getItem('user')
}

export function getToken () {
  return localStorage.getItem('token')
}

export function removeToken () {
  localStorage.removeItem('token')
}

export function removeUser () {
  localStorage.removeItem('user')
}

export function storeToken (token) {
  if (token || token !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

export function storeUser (user) {
  if (user || user !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function isAuthenticated () {
  log.trace('Auth.isAuthenticated() :: getToken()', !!getToken())
  return !!getToken()
}

export const setup = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      var token = getToken()
      var decodedToken = decodeToken(token)
      var user = JSON.parse(getUser())
      const date = new Date().getTime()

      // check if the token is expired or not
      if (decodedToken.exp * 1000 < date) {
        log.debug('Auth.setup() :: token is expired, clearing it and redirecting to login pages.')
        dispatch(logout())
        browserHistory.push('/auth/login')
      } else if (token && user) {
        log.debug('Auth.setup() :: token and user exists in localStorage, initiating authLoginSuccess()')
        dispatch(authLoginSuccess({ user, token }))
      } else {
        log.debug('Auth.setup() :: token/user doesn\'t exist in localStorage, initiating authNotLoggedIn()')
        dispatch(authNotLoggedIn())
        browserHistory.push('/auth/login')
      }
    })
  }
}

export const logout = () => {
  return (dispatch, getState) => {
    dispatch(authLogoutRequest())
    dispatch(setIsLoading(KEYS.AUTH, true))
    removeToken()
    removeUser()
    // mock backend call
    setTimeout(() => {
      dispatch(setIsLoading(KEYS.AUTH, false))
      dispatch(setHasResults(KEYS.AUTH, false))
      dispatch(authLogoutSuccess())
      browserHistory.push('/auth/login')
    }, 3000)
  }
}

export const login = (payload) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(authLoginRequest(payload))
      dispatch(setIsLoading(KEYS.AUTH, true))
      log.debug('Auth::login::initial', payload)
      Api.post('/auth/login/' + payload.loginType,
        { auth: false },
        {
          username: payload.username,
          password: payload.password
        })
      .then((response) => {
        log.debug('Auth::login::success', response)
        return response
      })
      .then(({ data }) => {
        storeToken(data.data.token)
        storeUser(data.data.user)
        dispatch(setIsLoading(KEYS.AUTH, false))
        dispatch(setHasResults(KEYS.AUTH, (!isEmpty(data.data.user) && !isEmpty(data.data.token))))
        dispatch(authLoginSuccess({ user: data.data.user, token: data.data.token }))
        browserHistory.push('/')
      })
      .catch((error) => {
        // dispatch(setIsLoading(KEYS., false))
        dispatch(handleApiErrors(KEYS.AUTH, error))
        // dispatch(authLoginFailure(error))
      })
    })
  }
}

export const actions = {
  login,
  logout,
  setup,
  getToken,
  isAuthenticated
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [AUTH_LOGIN_REQUEST]: (state, { payload }) => {
    return {
      ...state
    }
  },
  [AUTH_LOGIN_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isAuthenticated: true,
      token: payload.token,
      user: payload.user
    }
  },
  [AUTH_NOT_LOGGED_IN]: (state, { payload }) => {
    return {
      ...state,
      user: null,
      token: null,
      errors: payload
    }
  },
  [AUTH_LOGIN_FAILURE]: (state, { payload }) => {
    return {
      ...state,
      user: null,
      token: null,
      errors: payload
    }
  },
  [AUTH_LOGOUT_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      user: null,
      token: null
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
