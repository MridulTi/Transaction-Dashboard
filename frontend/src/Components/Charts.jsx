import React from 'react'
import { Bar } from 'react-chartjs-2'
import Chart from 'chart.js/auto'


export const BarChart = ({ chartData }) => {
  // console.log(chartData)
  return (
    <Bar data={chartData} options={{
      responsive:true
    }} className='aspect-video text-xl' />
  )
}