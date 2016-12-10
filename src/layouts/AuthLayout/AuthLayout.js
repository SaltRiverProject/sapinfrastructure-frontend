import React, { PropTypes } from 'react'

import './AuthLayout.scss'

import Notification from 'containers/Notification'
export const AuthLayout = ({ children }) => (
  <div className='AuthLayout layout'>
    <Notification />
    {children}
  </div>
)

AuthLayout.propTypes = {
  children : PropTypes.element.isRequired
}

export default AuthLayout
