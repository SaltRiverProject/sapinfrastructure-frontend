import React, { PropTypes } from 'react'
import { Line } from 'react-chartjs-2'

const LineChartComponent = ({ title, data, options, width, height }) => (<div className='LineChartComponent'>
  <h4 className='text-center'>
    <strong>{title}</strong>
  </h4>
  <Line
    data={data}
    options={options}
    width={width}
    height={height}
  />
</div>)

LineChartComponent.propTypes = {
  title: PropTypes.any,
  data: PropTypes.any,
  options: PropTypes.any,
  width: PropTypes.any,
  height: PropTypes.any
}

export default LineChartComponent
