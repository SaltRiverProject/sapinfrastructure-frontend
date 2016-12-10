import { injectReducer } from 'store/reducers'
import { actions as Dashboard } from './modules/dashboard'

export default (store) => ({
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const DashboardContainer = require('./containers/DashboardContainer').default
      const reducer = require('./modules/dashboard').default

      /*  Add the reducer to the store on key 'dashboard'  */
      injectReducer(store, { key: 'dashboard', reducer })

      /*  Return getComponent   */
      cb(null, DashboardContainer)

    /* Webpack named bundle   */
    }, 'dashboard')
  },
  onEnter: (nextState, replace) => {
    const { dispatch } = store
    dispatch(Dashboard.load())
  }
})
