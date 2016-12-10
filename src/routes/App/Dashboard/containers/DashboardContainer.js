import { connect } from 'react-redux'
import DashboardComponent from '../components/Dashboard'
import { actions as Dashboard } from '../modules/dashboard'

const mapStateToProps = (state) => ({
  isLoading:  state.isLoading.DASHBOARD,
  hasResults: state.hasResults.DASHBOARD,
  hasError:   state.hasError.DASHBOARD,
  auth:       state.auth,
  dashboard:  state.dashboard
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent)
