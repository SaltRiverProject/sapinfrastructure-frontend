require('es6-promise').polyfill()
import axios from 'axios'

import _ from 'lodash'
import log from 'middleware/logger'

import { actions as Auth } from 'store/auth'

function _buildUrl (endpoint, params) {
  let url = (__DEV__) ? 'http://localhost:1337/v1' : 'https://api.sapinfrastructure.srp.gov/v1'
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

export const handleErrors = (response) => {
  if (response.status >= 200 && response.status <= 300) {
    return response
  } else if (response.status === 401 || response.status === 403) {
    return response
  }
}

export const Api = {
  get: function (route, params, payload) {
    return new Promise(function (resolve, reject) {
      let p = _.merge({}, params)
      let headers = _.merge({}, p.headers)
      if (p.auth) {
        delete p.auth
        headers.authorization = 'Bearer ' + Auth.getToken()
      }

      if (p.populate) {
        p.populate = p.populate.join(',')
      }

      const url = _buildUrl(route, p)
      log.trace('Api::get::initial', url, p, payload, headers)

      return axios.get(url, {
        method: 'GET',
        p,
        headers
      })
      .then((response) => {
        log.trace('Api::get::response', url)
        return resolve(response)
      })
      .catch((error) => {
        log.error('Api::get::error', error.message, error.response)
        return reject({ ...error.response })
      })
    })
  },
  put: function (route, params, payload) {
    return new Promise(function (resolve, reject) {
      let headers = _.merge({}, params.headers)
      if (params.auth) {
        delete params.auth
        headers.authorization = 'Bearer ' + Auth.getToken()
      }

      if (params.populate) {
        params.populate = params.populate.join(',')
      }

      const url = _buildUrl(route)
      log.trace('Api::put::initial', url, params, payload, headers)

      return axios({
        url,
        method: 'PUT',
        params,
        headers,
        data: payload
      })
      .then((response) => {
        log.trace('Api::put::response', url)
        return resolve(response)
      })
      .catch((error) => {
        log.error('Api::put::error', error.message, error.response)
        return reject({ ...error.response })
      })
    })
  },
  post: function (route, params, payload) {
    return new Promise(function (resolve, reject) {
      let headers = _.merge({}, params.headers)
      let p = {
        ...params
      }
      if (params.auth) {
        // delete p.auth
        headers.authorization = 'Bearer ' + Auth.getToken()
      }

      if (params.populate) {
        p.populate = _.merge({}, params.populate.join(','))
      }

      const url = _buildUrl(route)
      log.trace('Api::post::initial', url, p, payload, headers)
      return axios({
        url,
        method: 'POST',
        p,
        headers,
        data: payload
      })
      .then((response) => {
        log.trace('Api::post::response', url, response)
        resolve(response)
      })
      .catch((error) => {
        log.error('Api::post::error', error.message, error.response)
        return reject({ ...error.response })
      })
    })
  },
  delete: function (route, params, payload) {
    return new Promise(function (resolve, reject) {
      let headers = _.merge({}, params.headers)
      let p = {
        ...params
      }
      if (params.auth) {
        // delete p.auth
        headers.authorization = 'Bearer ' + Auth.getToken()
      }

      if (params.populate) {
        p.populate = _.merge({}, params.populate.join(','))
      }

      const url = _buildUrl(route)
      log.trace('Api::delete::initial', url, p, payload, headers)
      return axios({
        url,
        method: 'DELETE',
        p,
        headers,
        data: payload
      })
      .then((response) => {
        log.trace('Api::delete::response', url, response)
        resolve(response)
      })
      .catch((error) => {
        log.error('Api::delete::error', error.message, error.response)
        return reject({ ...error.response })
      })
    })
  }
}
export default Api
