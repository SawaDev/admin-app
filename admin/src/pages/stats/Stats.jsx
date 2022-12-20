import React, { useEffect, useMemo, useState } from 'react'
import LineChart2 from '../../components/lineChart/LineChart'
import Navbar from '../../components/navbar/Navbar'
import PieChart from '../../components/pieChart/PieChart'
import { publicRequest } from '../../requestMethods'
import "./stats.css"
const Stats = () => {
  const [filter, setFilter] = useState("money");
  const [monthly, setMonthly] = useState([]);

  const handleFilter = (e) => {
    setFilter(e.target.value);
    // setMonthly([]);
  }

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getSales = async () => {
      try {
        const res = await publicRequest.get(`/kamars/monthlyStats?filterBy=${filter}`);
        const list = res.data.sort((a, b) => {
          return a._id - b._id
        })

        list.map((item) =>
          setMonthly((prev) => [
            ...prev,
            {
              name: MONTHS[item._id - 1],
              "keldi": item.monthlyKeldi,
              "ketdi": item.monthlyKetdi,
            }
          ]))
      } catch (err) {
        console.log(err);
      }
    }
    getSales();
  }, [filter])
console.log(filter)
  return (
    <div className="flex flex-col mb-10">
      <div className="bg-main-bg navbar w-full">
        <Navbar />
      </div>

      <div className="h-full w-full">
        <p className="font-bold text-xl text-gray-600 p-3">Analytics Depending On Filters</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 md:mt-0 m-4">
          <PieChart filter="category" />
          <PieChart filter="color" />
          <PieChart filter="temir" />
        </div>
      </div>
      <div className="mt-10 p-3 sm:p-3 md:p-5">
        <div className="flex justify-between mb-4">
          <p className="text-2xl md:text-3xl">Analytic of Sales</p>
          <div className="">
            <select className="mb-2 shadow-xl text-xl p-2 capitalize" onChange={handleFilter}>
              <option>money</option>
              <option>number</option>
            </select>
          </div>
        </div>
        <div className="lineChart w-full">
          <LineChart2 data={monthly}/>
        </div>
      </div>
    </div>
  )
}

export default Stats