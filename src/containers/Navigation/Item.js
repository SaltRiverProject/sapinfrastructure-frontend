import React, { PropTypes } from 'react'
import { NavItem } from 'react-bootstrap'

export default class NavigationItem extends React.Component {

  static propTypes = {
    route: PropTypes.object.isRequired,
    isActive: PropTypes.string.isRequired
  }

  render () {
    const { route } = this.props
    return (<NavItem href={route.path}>
      {route.name}
    </NavItem>)
  }
}
