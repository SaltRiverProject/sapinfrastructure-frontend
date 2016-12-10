export const createRoutes = (store) => ({
  path: '/auth/login',
  getIndexRoute (location, next) {
    require.ensure([
      './Login'
    ], (require) => {
      const LoginRoute = require('./Login').default(store)
      next(null, LoginRoute)
    })
  }
})
export default createRoutes
