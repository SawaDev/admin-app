import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Chart({ data, symbol }) {
  const [labels, setLabels] = useState([])
  const [values, setValues] = useState([])
  const [backgroundColor, setBackgroundColor] = useState([])

  useEffect(() => {
    if (data) {
      const labels = Object.keys(data).map(key => (key))
      setLabels(labels)

      const values = Object.keys(data).map(key => (data[key][symbol]))
      setValues(values)

      const backgroundColor = Object.keys(data).map(() => ('#f67f90'))
      setBackgroundColor(backgroundColor)
    }
  }, [data])

  const optionss = {
    responive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Exchange Rates',
      },
    },
  }

  const options = {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Exchange Rates',
      fontSize: 25,
    },
    legend: {
      display: false,
    }
  }
  return (
    <Line
      data={{
        labels: labels,
        datasets: [
          {
            label: 'Value',
            data: values,
            backgroundColor: backgroundColor,
            borderWidth: 2,
            fill: false,
          },
        ],
      }}
      options={optionss}
    />
  )
}

export default Chart