import React from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import Chart from 'chart.js/auto'


export const BarChart = ({ chartData }) => {
  // console.log(chartData)
  return (
    <Bar data={chartData} options={{
      responsive:true
    }} className='aspect-video text-xl' />
  )
}

export const PieChart = ({ chartData }) => {

  return (
    <Pie data={chartData} options={{
      responsive:true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }} className='text-xl' />
  )
}