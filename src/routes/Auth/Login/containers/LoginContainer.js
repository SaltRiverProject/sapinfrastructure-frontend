import { connect } from 'react-redux'
import Login from '../components/Login'

import { actions as Auth } from 'store/auth'
const mapStateToProps = (state) => ({
  auth : state.auth,
  isLoading: state.isLoading.AUTH,
  hasResults: state.hasResults.AUTH,
  hasError: state.hasError.AUTH
})

const mapDispatchToProps = {
  doLogin: (payload) => Auth.login(payload)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
