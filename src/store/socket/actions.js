import SocketIOClient from 'socket.io-client'
import SailsIOClient from 'sails.io.js'
import _ from 'lodash'
import log from 'middleware/logger'
import { actions as Auth } from 'store/auth'
import { normalize } from 'normalizr'
import * as schema from '../schema'
import { KEYS, setHasError, setIsLoading, setHasResults, handleApiErrors } from '../StateKeys'
// import { actions as Notification } from 'store/notification'

// import { actions as Server } from 'store/servers'

const endpointActions = {
  Server: {
    // ...Server
  }
}

import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
  SOCKET_RECONNECTING,
  SOCKET_LOAD_DATA,
  SOCKET_LOADED_DATA,
  SOCKET_SELECT_DATA,
  SOCKET_SELECTED_DATA,
  SOCKET_CREATE_DATA,
  SOCKET_CREATED_DATA,
  SOCKET_UPDATE_DATA,
  SOCKET_UPDATED_DATA
} from './constants'

const endpoints = ['server']

const socketConnected = (payload) => ({
  type: SOCKET_CONNECTED,
  payload
})
const socketDisconnected = (payload) => ({
  type: SOCKET_DISCONNECTED,
  payload
})
const socketReconnecting = (payload) => ({
  type: SOCKET_RECONNECTING,
  payload
})
const loadData = (params) => ({
  type: SOCKET_LOAD_DATA,
  params
})
const loadedData = ({ entities, result }) => ({
  type: SOCKET_LOADED_DATA,
  entities,
  result
})
const selectData = (params) => ({
  type: SOCKET_SELECT_DATA,
  params
})
const selectedData = ({ entities, result }) => ({
  type: SOCKET_SELECTED_DATA,
  entities,
  result
})
const createdData = (endpoint, { id, data, previous }) => ({
  type: SOCKET_CREATED_DATA,
  endpoint,
  id,
  data,
  previous
})
const updatedData = (endpoint, { id, data, previous }) => ({
  type: SOCKET_UPDATED_DATA,
  endpoint,
  id,
  data,
  previous
})
export const connected = (payload) => {
  return (dispatch, getState) => {
    dispatch(socketConnected(payload))
  }
}
export const disconnected = () => {
  return (dispatch, getState) => {
    dispatch(socketDisconnected())
  }
}
export const reconnecting = () => {
  return (dispatch, getState) => {
    dispatch(socketReconnecting())
  }
}

function initialCase (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function depluralize (string) {
  if (string.charAt(string.length - 1) === 's') {
    return string.slice(0, -1)
  } else {
    return string
  }
}

function _buildUrl (endpoint, params) {
  let url = '/v1'
  let finalParams = ''

  var i = 0
  if (endpoint.charAt(0) !== '/') {
    url += '/'
  }

  if (params) {
    _.each(params, function (k, v) {
      if (i === 0) {
        finalParams += '?' + v + '=' + k
      } else {
        finalParams += '&' + v + '=' + k
      }
      i++
    })
  }

  url += endpoint + finalParams
  return url
}

export const Api = {
  get: (endpoint, params = {}) => {
    return new Promise((resolve, reject) => {
      params = _.merge({}, params)

      if (params.populate) {
        params.populate = params.populate.join(',')
      }

      const url = _buildUrl(endpoint, params)
      // log.debug('Socket::get::initial', url, params, socket, window.socket)
      socket.get(url, params, function (res, jwr) {
        log.debug('Socket::get::response', url, res, jwr)

        /* @TODO catch auth errors like 4xx and server errors like 5xx */
        if (jwr.statusCode !== 200) {
          return reject('Status code not 200')
        }
        resolve(res.data)
      })
    })
  }
}

export const find = (endpoint, params = {}) => (dispatch, getState) => {
  const capitalizedEndpoint = initialCase(endpoint)
  const depluralizedEndpoint = depluralize(capitalizedEndpoint)

  params = _.merge({}, params)
  log.debug(capitalizedEndpoint + '::find::initial', params)
  dispatch(loadData(params))
  dispatch(setIsLoading(KEYS[depluralizedEndpoint.toUpperCase()], true))

  Api.get(endpoint, params)
  .then((response) => {
    const normalizedData = normalize(response, schema['arrayOf' + initialCase(endpoint)])
    dispatch(loadedData({ entities: normalizedData.entities, result: normalizedData.result }))

    dispatch(setIsLoading(KEYS[depluralizedEndpoint.toUpperCase()], false))
    dispatch(setHasResults(KEYS[depluralizedEndpoint.toUpperCase()], !_.isEmpty(normalizedData.entities)))
    log.debug(capitalizedEndpoint + '::find::response', params, response)
    return response
  })
}

export const findOne = (endpoint, id, params = {}) => (dispatch, getState) => {
  const capitalizedEndpoint = initialCase(endpoint)
  const depluralizedEndpoint = depluralize(capitalizedEndpoint)

  params = _.merge({}, params)
  log.debug(capitalizedEndpoint + '::find::initial', params)
  dispatch(selectData(params))
  dispatch(setIsLoading(KEYS[depluralizedEndpoint.toUpperCase()], true))

  Api.get(endpoint + '/' + id, params)
  .then((response) => {
    const normalizedData = normalize(response, schema[initialCase(endpoint)])
    dispatch(selectedData({ entities: normalizedData.entities, result: normalizedData.result }))

    dispatch(setIsLoading(KEYS[depluralizedEndpoint.toUpperCase()], false))
    dispatch(setHasResults(KEYS[depluralizedEndpoint.toUpperCase()], !_.isEmpty(normalizedData.entities)))
    log.debug(capitalizedEndpoint + '::find::response', params, response)
    return response
  })
}

export const connect = () => (dispatch, getState) => {
  const state = getState()
  if (!state.data.isConnected && state.data.socket === null) {
    log.trace('Socket connecting')
    let io = SailsIOClient(SocketIOClient)
    io.sails.autoConnect = false
    io.sails.headers = {
      authorization: 'Bearer ' + Auth.getToken()
    }
    io.sails.url = (__DEV__) ? 'http://localhost:1337' : 'https://api.sapinfrastructure.srp.gov'
    window.socket = io.sails.connect()
  }

  socket.on('connect', () => {
    log.debug('Socket connected')
    dispatch(connected(socket))
  })

  socket.on('disconnect', () => {
    log.debug('Socket disconnected')
    dispatch(disconnected())
  })

  socket.on('reconnecting', () => {
    log.debug('Socket reconnecting')
    dispatch(reconnecting())
  })

  _.each(endpoints, (endpoint, i) => {
    socket.on(endpoint, (res, jwr) => {
      switch (res.verb) {
        case 'updated':
          dispatch(Notification.emit({
            msg: initialCase(endpoint) + ' updated by ' + res.previous.updatedBy.username,
            visible: true,
            dismissable: true,
            type: 'success'
          }))
          dispatch(updatedData(
            endpoint, { id: res.id, data: res.data, previous: res.previous })
          )
          break
        case 'deleted':
          break
        case 'created':
          dispatch(Notification.emit({
            msg: initialCase(endpoint) + ' created by ' + res.previous.createdBy.username,
            visible: true,
            dismissable: true,
            type: 'success'
          }))
          dispatch(createdData(
            endpoint, { id: res.id, data: res.data, previous: res.previous })
          )
          break
      }
    })
  })
}

export const actions = {
  connect,
  connected,
  disconnected,
  find,
  findOne
}

export const ACTION_HANDLERS = {
  [SOCKET_CONNECTED]: (state, action) => {
    return {
      ...state,
      socket: action,
      isConnected: true
    }
  },
  [SOCKET_DISCONNECTED]: (state, { payload }) => {
    return {
      ...state,
      socket: null,
      isConnected: false
    }
  },
  [SOCKET_RECONNECTING]: (state, { payload }) => {
    return {
      ...state,
      socket: null,
      isConnected: false
    }
  },
  [SOCKET_LOAD_DATA]: (state, { params }) => {
    return {
      ...state,
      params
    }
  },
  [SOCKET_LOADED_DATA]: (state, { entities, result }) => {
    return {
      ...state,
      entities,
      result
    }
  },
  [SOCKET_SELECT_DATA]: (state, { params }) => {
    return {
      ...state,
      params
    }
  },
  [SOCKET_SELECTED_DATA]: (state, { entities, result }) => {
    return {
      ...state,
      entities,
      result
    }
  },
  [SOCKET_CREATED_DATA]: (state, { endpoint, entities, result }) => {
    return {
      ...state,
      entities,
      result
    }
  },
  [SOCKET_UPDATED_DATA]: (state, { endpoint, id, data, previous }) => {
    const newState = _.merge({}, state)
    const newItem = _.merge({}, newState.entities[endpoint + 's'][id], data)
    newState.entities[endpoint + 's'][id] = newItem
    return newState
  }
}
