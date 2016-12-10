import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import '../../styles/core.scss'
import './BaseLayout.scss'

export class BaseLayout extends Component {
  static propTypes = {
    children : PropTypes.element.isRequired,
    route    : PropTypes.object.isRequired,
    auth     : PropTypes.object.isRequired,
    app      : PropTypes.object.isRequired
  }

  render () {
    const { children } = this.props
    return (<div className='BaseLayout layout'>
      {children}
    </div>)
  }
}

export default connect((state) => ({
  auth: state.auth,
  app: state.app
}))(BaseLayout)
