import Servers from './containers/ServersContainer'
import { actions as Socket } from 'store/socket'

export default (store) => ({
  component: Servers,
  onEnter: (nextState, replace) => {
    const { dispatch } = store
    dispatch(Socket.find('servers'))
  }
})
