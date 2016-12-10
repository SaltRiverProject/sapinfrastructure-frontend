import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import { Link } from 'react-router'
import classnames from 'classnames'

import SocketStatus from './SocketStatus'
import NavigationItem from './Item'
import log from 'middleware/logger'

import './style.scss'
export class Navigation extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    app:  PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: React.PropTypes.any
  }

  render () {
    const { auth, data, app } = this.props
    const user = auth.user
    // const _isAdmin = () => {
    //   return user.group.some((group, index) => {
    //     return (group.accessLevel > 1)
    //   })
    // }

    const _isAdmin = () => {
      return (user.group.accessLevel > 1)
    }

    let _isActive = (path) => {
      return location.pathname === path
    }

    const navItems = app.navigationItems.map((item, index) => {
      const _classnames = classnames({
        'nav': true,
        'navbar-nav': true,
        'navbar-right': (item.pull === 'right')
      })
      const childItems = item.children.map((child, i) => (
        <li key={i} className={classnames({ 'active': _isActive(child.link) })}>
          <Link to={child.link}>{child.title}</Link>
        </li>
      ))
      return (<ul className={_classnames} key={index}>{childItems}</ul>)
    })

    return (<div className='Navigation'>
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a className='navbar-brand' href='#'>SAP Infrastructure</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {navItems}
          <Nav pullRight>
            <SocketStatus isConnected={data.isConnected} />
          </Nav>
          <Nav pullRight>
            <NavDropdown title={'Hello ' + user.username} id='welcome-message' className='profile-menu'>
              <MenuItem className='text-center' >
                <img src={user.photo} className='img-circle' />
              </MenuItem>
              <MenuItem>
                <h4 className='fullName text-center'>{user.firstName + ' ' + user.lastName}</h4>
              </MenuItem>
              <MenuItem divider />
              {(user.accountType === 'local') &&
                <MenuItem href='/user/changePassword'>Change Password</MenuItem>
              }
              <MenuItem divider />
              <MenuItem href='/auth/logout'>Logout</MenuItem>
            </NavDropdown>
          </Nav>
          {_isAdmin() &&
            <ul className='nav navbar-nav pull-right'>
              <li className={classnames({ 'active': _isActive('/users') })}>
                <Link to='/users'>Users</Link>
              </li>
              <li className={classnames({ 'active': _isActive('/groups') })}>
                <Link to='/groups'>Groups</Link>
              </li>
            </ul>
          }
        </Navbar.Collapse>
      </Navbar>
    </div>)
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  app: state.app,
  location: state.location,
  data: state.data
})
export default connect(mapStateToProps)(Navigation)
