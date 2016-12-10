import React from 'react'
import classnames from 'classnames'

const SocketStatus = ({ isConnected }) => {
  const _classnames = classnames({
    'fa': true,
    'fa-circle': true,
    'text-danger': !isConnected,
    'text-success': isConnected
  })
  return (<li>
    <a>
      <i className={_classnames} />
    </a>
  </li>)
}

SocketStatus.propTypes = {
  isConnected: React.PropTypes.bool.isRequired
}
export default SocketStatus
