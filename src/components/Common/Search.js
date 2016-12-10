import React, { PropTypes, Component } from 'react'

class SearchComponent extends Component {
  static propTypes = {
    handleSearch: PropTypes.func.isRequired
  }

  keyUpTimeout = null

  _handleSearch = () => {
    const query = this.refs.search.value
    const { handleSearch } = this.props
    handleSearch(query)
  }

  _onKeyUp = (event) => {
    clearTimeout(this.keyUpTimeout)

    this.keyUpTimeout = setTimeout(() => {
      this._handleSearch()
    }, 500)
  }
  render () {
    return (<div className='SearchComponent'>
      <input
        type='text'
        ref='search'
        placeholder='Search or filter'
        className='form-control input-lg'
        onKeyUp={this._onKeyUp}
      />
    </div>)
  }
}
export default SearchComponent
