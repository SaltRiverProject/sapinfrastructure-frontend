import React, { PropTypes, Component } from 'react'
import ReactTable from 'react-table'
import { Link } from 'react-router'
import randomcolor from 'randomcolor'

import { PieChart, LineChart } from 'components/Charts'
import { NoResults, IsLoading } from 'components/Common'
import './styles.scss'
export default class Dashboard extends Component {
  static propTypes = {
    isLoading:     PropTypes.bool.isRequired,
    hasResults:    PropTypes.bool.isRequired,
    hasError:      PropTypes.bool.isRequired,
    auth:          PropTypes.object.isRequired,
    dashboard:     PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const _LineChartmockData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40],
          spanGaps: false
        }
      ]
    }

    const { isLoading, hasResults, dashboard } = this.props
    console.log(isLoading, hasResults, dashboard)
    return (<div className='DashboardComponent component'>
      <h1>Dashboard</h1>
      {(!isLoading && hasResults) &&
        <div className='row'>
          <div className='col-sm-4'>
            <PieChart
              title='Servers By Tier'
              data={{
                labels: dashboard.groupbytier.map((item) => item.abbreviation),
                datasets: [
                  {
                    data: dashboard.groupbytier.map((item) => item.count),
                    backgroundColor: randomcolor({ count: dashboard.groupbytier.length }),
                    hoverBackgroundColor: randomcolor({ count: dashboard.groupbytier.length })
                  }
                ]
              }}
            />
          </div>
          <div className='col-sm-4'>
            <PieChart
              title='Servers By Component'
              data={{
                labels: dashboard.groupbycomponent.map((item) => item.abbreviation),
                datasets: [
                  {
                    data: dashboard.groupbycomponent.map((item) => item.count),
                    backgroundColor: randomcolor({ count: dashboard.groupbycomponent.length }),
                    hoverBackgroundColor: randomcolor({ count: dashboard.groupbycomponent.length })
                  }
                ]
              }}
            />
          </div>
          <div className='col-sm-4'>
            <PieChart
              title='Servers By Location'
              data={{
                labels: dashboard.groupbylocation.map((item) => item.abbreviation),
                datasets: [
                  {
                    data: dashboard.groupbylocation.map((item) => item.count),
                    backgroundColor: randomcolor({ count: dashboard.groupbylocation.length }),
                    hoverBackgroundColor: randomcolor({ count: dashboard.groupbylocation.length })
                  }
                ]
              }}
            />
          </div>
          <div className='col-sm-4'>
            <LineChart
              title='Test Line Chart'
              data={_LineChartmockData}
            />
          </div>
          <div className='col-sm-2'>
            <h4 className='text-center'><strong>Disconnected Agents</strong></h4>
            <ul className='OutOfSyncHosts'>
              {dashboard.disconagents.map((item, index) => (<li key={index}>
                <Link to={'/servers/' + item.serverId + '/' + item.serverHostname.toLowerCase()}>
                  {item.serverHostname}
                </Link>
              </li>))}
            </ul>
          </div>
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
