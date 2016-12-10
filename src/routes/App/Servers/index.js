export default (store) => ({
  path: 'servers',
  getIndexRoute (location, next) {
    require.ensure([
      './List'
    ], (require) => {
      const ListRoute = require('./List').default(store)
      next(null, ListRoute)
    })
  }
})
