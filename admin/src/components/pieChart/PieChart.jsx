import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { userRequest } from '../../requestMethods';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ filter }) => {
  const [info, setInfo] = useState([]);
  const [value, setValue] = useState("Money");

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await userRequest.get(`/kamars/piedata?filter=${filter}`);
        setInfo(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getInfo();
  }, [])

  const data = {
    datasets: [
      {
        label: '# of Votes',
        data: value == "Money" ? info.map((d) => d.totalMoney) : info.map((d) => d.totalSoni),
        backgroundColor: [
          'rgba(54, 162, 235, 0.4)',
          'rgba(0, 255, 0, 0.4)',
          'rgba(255,0,0, 0.4)',
          'rgba(255, 99, 132, 0.4)',
          'rgba(255,215,0, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(255, 159, 64, 0.4)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(245,222,179, 0.4)',
          'rgba(0,0,0, 0.3)',
        ],
        borderWidth: 1,
      },
    ],
    labels: info.map((d) => d._id),
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-3">
      <div>
        <p className="text-lg mb-3 capitalize">Analytics Of Sales By {filter}</p>
        <select className="mb-2 shadow-md" onChange={handleChange}>
          <option>Money</option>
          <option>Soni</option>
        </select>
      </div>
      <Pie data={data} />
    </div>
  )
}

export default PieChart