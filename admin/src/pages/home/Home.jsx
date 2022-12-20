import "./home.css";
import api from '../../api'
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import { useEffect, useState } from 'react'
import { userRequest, publicRequest } from "../../requestMethods";

const Home = () => {
  const [data, setData] = useState('');
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [value, setValue] = useState(1);
  const [convertedValue, setConvertedValue] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0)
  const [base, setBase] = useState('USD')
  const [symbol, setSymbol] = useState('UZS')
  const [symbols, setSymbols] = useState({
    "UZS": {
      "description": "Uzbekistan Som",
      "code": "UZS"
    },
    "USD": {
      "description": "United States Dollar",
      "code": "USD"
    },
  })
  const [stats, setStats] = useState([])

  useEffect(() => {
    api.getCurrentQuote(base, symbol)
      .then(response => {
        if (response.error) console.log(response.error)
        else setCurrentQuote(response)
      })
  }, [base, symbol])

  useEffect(() => {
    setConvertedValue(value * currentQuote)
  }, [value, currentQuote])

  useEffect(() => {
    const date = new Date()
    const year = date.getFullYear()
    const endMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const endFullDate = `${year}-${endMonth}-${day}`
    setEndDate(endFullDate)

    const startMonth = date.getMonth().toString().padStart(2, '0');
    const startFullDate = `${startMonth === '00' ? year - 1 : year}-${startMonth === '00' ? '12' : startMonth}-${day}`

    setStartDate(startFullDate)
  }, [])

  useEffect(() => {
    api.getTimeSeries(startDate, endDate, base, symbol)
      .then(response => {
        if (response.error) console.log(response.error)
        else setData(response)
      })
  }, [startDate, endDate, base, symbol])

  useEffect(() => {
    api.getSymbols()
      .then(response => {
        if (response.error) console.log(response.error)
        else setSymbols(response)
      })
  }, [])

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("/kamars/warehouse");
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getStats();
  }, [])
  const listClass = "flex flex-col items-start pr-1 pl-1 mb-1"
  return (
    <div className="flex relative ">

      <div className="bg-main-bg min-h-screen w-full">
        <div className="fixed md:static bg-main-bg navbar w-full">
          <Navbar />
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-1 mt-20 md:mt-0">
          <div>
            <Widget type="warehouse" stats={stats} />
          </div>
          <div>
            <Widget type="money_in_warehouse" stats={stats} />
          </div>
          <div>
            <Widget type="earning" stats={stats} />
          </div>
          <div className="align-self-center">
            <Widget type="balance" stats={stats} />
          </div>
        </div>

        <div className="">
          <div className="flex flex-col gap-10 p-6">
            <Chart data={data} symbol={symbol} />
            <ul className="grid grid-cols-2 w-full">
              <li className="flex flex-col items-start  pr-1 pl-1 mb-2">
                <label htmlFor="start-date" className="mr-3 w-30">Initial Date</label>
                <input className="w-full bg-gray-100 p-3" type="date" name="start-date" value={startDate} onChange={event => setStartDate(event.target.value)} />
              </li>
              <li className={listClass}>
                <label htmlFor="end-date" className="mr-3 w-30">Final date</label>
                <input className="w-full bg-gray-100 p-3" type="date" name="end-date" value={endDate} onChange={event => setEndDate(event.target.value)} />
              </li>
              <li className={listClass}>
                <label htmlFor="from" className="mr-3 w-30">From</label>
                <select className="w-full bg-gray-100 p-3" name="from" id="from" value={base} onChange={event => setBase(event.target.value)}>
                  {Object.keys(symbols).map(key => (
                    <option value={key} key={key}>{symbols[key].description}</option>
                  ))}
                </select>
              </li>
              <li className={listClass}>
                <label htmlFor="to" className="mr-3 w-30">To</label>
                <select className="w-full bg-gray-100 p-3" name="to" id="to" value={symbol} onChange={event => setSymbol(event.target.value)}>
                  {Object.keys(symbols).map(key => (
                    <option value={key} key={key}>{symbols[key].description}</option>
                  ))}
                </select>
              </li>
              <li className={listClass}>
                <label htmlFor="value" className="mr-3 w-30">Value</label>
                <input className="w-full bg-gray-100 p-3" type="number" value={value} onChange={event => setValue(event.target.value)} />
              </li>
              <li className={listClass}>
                <label htmlFor="convertedValue" className="mr-3 w-30">Converted Value</label>
                <span className="w-full bg-gray-100 p-3">{convertedValue}</span>
              </li>
            </ul>
          </div>
        </div>
        {/* <Featured className="" /> */}
        {/* <div className="pl-3 pt-3 overflow-scroll">
          <div className="text-gray-500 text-xl font-bold mb-4">Latest Transactions</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
