import React, { PropTypes } from 'react'
import { Pie } from 'react-chartjs-2'

const PieChartComponent = ({ title, data, options, width, height }) => (<div className='PieChartComponent'>
  <h4 className='text-center'>
    <strong>{title}</strong>
  </h4>
  <Pie
    data={data}
    options={options}
    width={width}
    height={height}
  />
</div>)

PieChartComponent.propTypes = {
  title: PropTypes.any,
  data: PropTypes.any,
  options: PropTypes.any,
  width: PropTypes.any,
  height: PropTypes.any
}

export default PieChartComponent
