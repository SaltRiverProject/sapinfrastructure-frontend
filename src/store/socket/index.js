
import {
  ACTION_HANDLERS,
  connect,
  find,
  findOne
} from './actions'

const initialState = {
  isConnected: false,
  isConnecting: false,
  socket: null,
  entities: {},
  result: []
}

export { Api } from './actions'
export const actions = {
  connect,
  find,
  findOne
}

export default function socketReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
