import {
  constants
} from 'store/user'

describe('(Redux Module) User', () => {
  it('Should export a constant LOAD_USER.', () => {
    expect(constants.LOAD_USER).to.equal('LOAD_USER')
  })
  it('Should export a constant LOADED_USER.', () => {
    expect(constants.LOADED_USER).to.equal('LOADED_USER')
  })
})
