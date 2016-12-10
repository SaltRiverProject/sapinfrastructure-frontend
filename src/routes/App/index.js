import ServersRoute from './Servers'

export default (store) => ({
  path: '/',
  getIndexRoute (location, next) {
    require.ensure([
      './Dashboard'
    ], (require) => {
      const DashboardRoute = require('./Dashboard').default(store)
      next(null, DashboardRoute)
    })
  },
  childRoutes: [
    ServersRoute(store)
  ]
})
