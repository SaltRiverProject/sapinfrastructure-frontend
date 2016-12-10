import { connect } from 'react-redux'
import ServersList from '../components/List'

const mapStateToProps = (state) => ({
  auth: state.auth,
  app: state.app,
  isLoading: state.isLoading.SERVER,
  hasResults: state.hasResults.SERVER,
  hasError: state.hasError.SERVER,
  data: state.data,
  servers: state.servers
})

export default connect(mapStateToProps)(ServersList)
