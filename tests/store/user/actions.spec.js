import {
  constants,
  actions,
  default as userReducer
} from 'store/user'

describe('(Redux Module) User', () => {
    it('Should return the previous state if an action was not matched.', () => {
      let state = userReducer(undefined, {})
      expect(state).to.equal(0)
      state = userReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(0)
      state = userReducer(state, increment(5))
      expect(state).to.equal(5)
      state = userReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(5)
    })
  })

  describe('(Action Creator) load', () => {
    it('Should be exported as a function.', () => {
      expect(actions.load).to.be.a('function')
    })
  })
})
