import {
  Notify,
  notificationReducer
} from 'containers/Notification'

describe.only('(Redux Module) Notification', () => {
  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(notificationReducer).to.be.a('function')
    })

    it('Should initialize with a state of {} (Object).', () => {
      expect(notificationReducer(undefined, {})).to.equal({
        maxItems: 4,
        dismissTimeout: 10000, // 10 seconds
        items: [],
        queue: []
      })
    })
  })

  describe('(Action Creator) emit', () => {
    it('Should be exported as a function.', () => {
      expect(Notify.emit).to.be.a('function')
    })

    it('Should return an action with type "EMIT_NOTIFICATION".', () => {
      expect(Notify.emit()).to.have.property('type', 'EMIT_NOTIFICATION')
    })

    it('Should assign the first argument to the "payload" property.', () => {
      const newNotification = {
        style: 'info',
        title: 'test 123',
        dismissable: true,
        message: new Date().toString()
      }
      expect(Notify.emit(newNotification)).to.have.property('payload', newNotification)
    })
  })
})
