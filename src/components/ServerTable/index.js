import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import _ from 'lodash'
import moment from 'moment'
import ReactTable from 'react-table'

import './style.scss'
class ServerTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      filteredData: []
    }
  }

  static propTypes = {
    rawData: PropTypes.object.isRequired,
    servers: PropTypes.array.isRequired,
    columns: PropTypes.array
  }

  componentDidMount () {
    this.setState({
      data: this.props.servers,
      filteredData: this.props.servers
    })
  }

  render () {
    const { rawData, servers, columns } = this.props
    const _columns = columns || [
      {
        header: 'Hostname',
        id: 'hostname',
        className: 'text-emphasis',
        accessor: (r) => (<Link to={'/servers/detail/' + r.id + '/' + r.hostname}> {r.hostname.toUpperCase()}</Link>),
        sortable: true
      },
      {
        header: 'SID',
        accessor: 'sid',
        headerClassName: 'text-center',
        className: 'text-center',
        sortable: true
      },
      {
        header: 'Tier',
        id: 'tier',
        accessor: (r) => (r.tier)
          ? (<Link to={'/tiers/detail/' + rawData.entities.tiers[r.tier].id + '/' + rawData.entities.tiers[r.tier].abbreviation.toLowerCase()}>
            {rawData.entities.tiers[r.tier].abbreviation}
          </Link>) : ('N/A'),
        headerClassName: 'text-center',
        className: 'text-center',
        sortable: true
      },
      {
        header: 'Component',
        id: 'component',
        accessor: (r) => (r.tier)
          ? (<Link to={'/components/detail/' + rawData.entities.components[r.component].id + '/' + rawData.entities.components[r.component].abbreviation.toLowerCase()}>
            {rawData.entities.components[r.component].abbreviation}
          </Link>) : ('N/A'),
        headerClassName: 'text-center',
        className: 'text-center',
        sortable: true
      },
      {
        header: 'Location',
        id: 'location',
        accessor: (r) => (r.location)
          ? (<Link to={'/locations/detail/' + rawData.entities.locations[r.location].id + '/' + rawData.entities.locations[r.location].abbreviation.toLowerCase()}>
            {rawData.entities.locations[r.location].abbreviation}
          </Link>) : ('N/A'),
        headerClassName: 'text-center',
        className: 'text-center',
        sortable: true
      },
      {
        header: 'CPU',
        accessor: 'cpu',
        headerClassName: 'text-center',
        className: 'text-center',
        sortable: true
      },
      {
        header: 'Memory',
        id: 'ram',
        accessor: (r) => r.ram + ' GB',
        headerClassName: 'text-center',
        className: 'text-center',
        sortable: true
      },
      {
        header: 'Swap',
        id: 'swap',
        accessor: (r) => r.swap + ' GB',
        headerClassName: 'text-center',
        className: 'text-center',
        sortable: true
      },
      {
        header: 'DNS Aliases',
        id: 'dns',
        accessor: (r) => (r.dns) ? r.dns.join(', ') : null
      },
      {
        header: 'Roles',
        id: 'roles',
        accessor: (r) => r.roles.map((role) => rawData.entities.roles[role].abbreviation).join(', ')
      },
      {
        header: 'Created At',
        id: 'createdAt',
        accessor: (row) => moment(row.createdAt).format('MM/DD/YYYY HH:mm:SS')
      },
      {
        header: 'Updated At',
        id: 'updatedAt',
        accessor: (row) => moment(row.updatedAt).format('MM/DD/YYYY HH:mm:SS')
      },
      {
        minWidth: 100,
        headerClassName: 'text-center',
        className: 'text-center',
        render: (r, v, i) => (<div className='btn-group'>
          <Link
            to={'/servers/detail/' + r.row.id + '/' + r.row.hostname.toLowerCase()}
            className='btn btn-sm btn-info'
          >
            <i className='fa fa-info' />
          </Link>
          <Link
            to={'/servers/edit/' + r.row.id + '/' + r.row.hostname.toLowerCase()}
            className='btn btn-sm btn-warning'
          >
            <i className='fa fa-pencil' />
          </Link>
          <button className='btn btn-sm btn-danger'>
            <i className='fa fa-trash' />
          </button>
        </div>)
      }
    ]
    return (<div className='ServerTableComponent Component'>
      <ReactTable
        data={servers}
        columns={_columns}
        {...this.props}
      />
    </div>)
  }
}
export default ServerTable
