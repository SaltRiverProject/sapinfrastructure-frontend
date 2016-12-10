import React, { PropTypes, Component } from 'react'
import _ from 'lodash'
import fuzzy from 'fuzzy'

import ServerTable from 'components/ServerTable'
import { NoResults, IsLoading, SearchComponent } from 'components/Common'
export default class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: [],
      pages: -1,
      loading: true
    }
  }
  static propTypes = {
    app: PropTypes.object.isRequired,
    data: PropTypes.object,
    auth: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    hasResults: PropTypes.bool.isRequired,
    hasError: PropTypes.bool.isRequired
  }

  handleSearch = (query) => {
    let results = fuzzy.filter(query, _.values(this.props.data.entities.servers))
    let matches = results.map((el) => el.string)
    console.log(results, matches)
  }

  render () {
    const { data, isLoading, hasError, hasResults } = this.props
    return (<div className='ServersComponent component'>
      <h1>Servers</h1>
      {(!isLoading && hasResults) &&
        <div>
          <SearchComponent handleSearch={this.handleSearch} />
          <hr />
          <ServerTable
            rawData={data}
            servers={_.values(data.entities.servers)}
          />
        </div>
      }
      {(isLoading) &&
        <IsLoading />
      }
      {((!isLoading && !hasResults)) &&
        <NoResults />
      }
    </div>)
  }
}
