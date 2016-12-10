import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classnames from 'classnames'

import NavigationItem from './NavItem'
export class Navigation extends Component {
  static propTypes = {
    auth  : PropTypes.object.isRequired,
    app   : PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object
  }

  render () {
    const { app } = this.props

    const _navItems = app.navigationItems.map((item, index) => {
      const _classnames = classnames({
        'nav': true,
        'navbar-nav': true,
        'navbar-right': (item.pull === 'right')
      })

      const _childNavItems = item.children.map((child, i) => {
        return (<NavigationItem item={child} key={i} />)
      })

      return (<ul className={_classnames} key={index}>
        {_childNavItems}
      </ul>)
    })

    return (<div className='NavigationContainer'>
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <Link className='navbar-brand' to='/'>{app.title}</Link>
          </div>
          <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
            {_navItems}
          </div>
        </div>
      </nav>
    </div>)
  }
}

const mapStateToProps = (state) => ({
  auth  : state.auth,
  app   : state.app
})
export default connect(mapStateToProps)(Navigation)
