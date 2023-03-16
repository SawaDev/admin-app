import Navbar from "../../components/navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useEffect, useMemo, useState } from "react";
import Chart2 from "../../components/chart2/Chart2";
import { kamarInputs } from "../../formSource";
import { publicRequest, userRequest } from "../../requestMethods";
import LineChart2 from "../../components/lineChart/LineChart";

const SingleKamar = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const path = location.pathname.split("/")[1];
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [kamarUp, setKamarUp] = useState({})
  const [monthly, setMonthly] = useState([]);
  const [filter, setFilter] = useState("money");
  const [sale, setSale] = useState({
    "keldi": 0,
    "ketdi": 0
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setSale((prev) => ({ ...prev, kamarId: id, [e.target.id]: parseInt(e.target.value) }));
    console.log(sale);
  };

  const handleChangeUpdate = (e) => {
    setKamarUp((prev) => (
      {
        ...prev,
        [e.target.id]: e.target.value
      }
    ))
  }

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const newSale = {
        ...sale,
      };

      await userRequest.post('/sales/newCollection', newSale)
      navigate(`/${path}`);
    } catch (err) {
      alert("Somthing wrong happened, when posting a sale!");
      console.log(err);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedKamar = {
        ...kamarUp,
      }

      await userRequest.put(`/kamars/${id}`, updatedKamar);
      navigate(`/${path}`);
    } catch (err) {
      alert("You are not allowed to do that!");
      console.log(err);
    }
  }

  useEffect(() => {
    const date = new Date()
    //keyingi kun uchun
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const nextYear = nextDate.getFullYear();
    const nextEndMonth = (nextDate.getMonth() + 1).toString().padStart(2, '0');
    const nextDay = nextDate.getDate().toString().padStart(2, '0');
    //start day uchun
    const year = date.getFullYear()
    const day = date.getDate().toString().padStart(2, '0');
    const endFullDate = `${nextYear}-${nextEndMonth}-${nextDay}`
    setEndDate(endFullDate)

    const startMonth = date.getMonth().toString().padStart(2, '0');
    const startFullDate = `${startMonth === '00' ? year - 1 : year}-${startMonth === '00' ? '12' : startMonth}-${day}`

    setStartDate(startFullDate)
  }, [])

  const handleFilter = (e) => {
    setFilter(e.target.value);
    setMonthly([]);
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
        const res = await publicRequest.get(`/kamars/monthlyStats?id=${id}&filterBy=${filter}`);
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
  }, [id, filter])

  const { data, loading } = useFetch(`https://admin-app-jxk8.onrender.com/api/kamars/find/${id}`);

  return (
    <div className="flex relative">
      <div className="w-full">
        <div className="fixed bg-main-bg navbar w-full">
          <Navbar />
        </div>

        {loading ? (
          "loading"
        ) : (
          <>
            <div className="grid lg:grid-cols-2 grid-rows-2 lg:grid-rows-1 h-fit w-full gap-8 px-3 mb-4 mt-20 md:mt-24">
              <div className="shadow-lg p-5 relative">
                <div className="text-purple-600 font-bold absolute t-0 l-0 p-1 pr-4 bg-purple-200 rounded rounded-br-2xl ">Info</div>
                <h1 className="text-center py-4 text-lg text-gray-600">Info</h1>
                <div className="flex flex-col gap-5 items-center text-center md:flex-row md:justify-around md:text-left">
                  <img
                    src={data.img}
                    alt="no image"
                    className="rounded-full w-44 h-44"
                  />
                  <div>
                    <h1 className="mb-3 text-gray-500 text-lg capitalize">{data.category}</h1>
                    <div className="mb-2.5 text-md">
                      <span className="font-bold text-gray-400">Size: </span>
                      <span className="font-light">{data.size}</span>
                    </div>
                    <div className="mb-2.5 text-md">
                      <span className="font-bold text-gray-400">Color: </span>
                      <span className="font-light">{data.color}</span>
                    </div>
                    <div className="mb-2.5 text-md">
                      <span className="font-bold text-gray-400">Temir: </span>
                      <span className="font-light">
                        {data.temir}
                      </span>
                    </div>
                    <div className="mb-2.5 text-md">
                      <span className="font-bold text-gray-400">Narxi: </span>
                      <span className="font-light">{data.price}</span>
                    </div>
                    <div className="mb-2.5 text-md">
                      <span className="font-bold text-gray-400">Soni: </span>
                      <span className="font-light">{data.soni}</span>
                    </div>
                    <div className="mb-2.5 text-md">
                      <span className="font-bold text-gray-400">Description: </span>
                      <span className="font-light">{data.desc}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shadow-lg  w-full">
                <Chart2 id={id} startDate={startDate} endDate={endDate} />
              </div>
            </div>
            <div className="grid px-5 gap-8 mb-10 lg:grid-cols-2">
              <div className="shadow-lg p-2 flex items-center">
                <ul className="flex flex-wrap flex-row w-full justify-around gap-5">
                  <li className="flex items-center px-1 mb-1">
                    <label htmlFor="start-date" className="w-25 mr-3">Initial Date</label>
                    <input type="date" name="start-date" className="bg-gray-100 p-2 rounded" value={startDate} onChange={event => setStartDate(event.target.value)} />
                  </li>
                  <li className="flex items-center px-1 mb-1">
                    <label htmlFor="end-date" className="w-25 mr-3">Final date</label>
                    <input type="date" name="end-date" className="bg-gray-100 p-2 rounded" value={endDate} onChange={event => setEndDate(event.target.value)} />
                  </li>
                </ul>
              </div>
              <div className="shadow-lg p-5">
                <form className="flex flex-wrap flex-row justify-around gap-5">
                  <div className="flex items-center px-1 mb-1">
                    <label className="mr-3">Keldi: </label>
                    <input
                      id="keldi"
                      onChange={handleChange}
                      type="number"
                      placeholder="Keldi"
                      className="bg-gray-100 p-3 rounded"
                    />
                  </div>
                  {/* <div className="flex items-center px-1 mb-1">
                    <label className="mr-3">Ketdi: </label>
                    <input
                      id="ketdi"
                      onChange={handleChange}
                      type="number"
                      placeholder="Sotildi"
                      className="bg-gray-100 p-3 rounded"
                    />
                  </div> */}
                  <button className="w-40 p-3 bg-teal-600 rounded text-white font-bold cursor-pointer" onClick={handleClick}>Update</button>
                </form>
              </div>
            </div>

            <form className="px-4 flex flex-wrap justify-between max-w-6xl mx-auto mb-10">
              {kamarInputs.map((input) => (
                <div className="w-2/5" key={input.id}>
                  <label className="flex items-center gap-2.5 text-lg">{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChangeUpdate}
                    type={input.type}
                    placeholder={input.placeholder}
                    className="bg-gray-100 p-3 rounded w-full"
                  />
                </div>
              ))}
              <button className="w-40 h-fit text-center my-auto p-3 justify-start bg-teal-600 rounded text-white font-bold cursor-pointer" onClick={handleUpdate}>Update</button>
            </form>
            <div className="flex justify-between mb-3 px-5">
              <p className="text-2xl md:text-3xl">Monthly Analytic</p>
              <div className="">
                <select className="mb-2 shadow-xl text-xl p-2 capitalize" onChange={handleFilter}>
                  <option>money</option>
                  <option>number</option>
                </select>
              </div>
            </div>
            <div className="lineChart w-full p-3 md:p-5">
              <LineChart2 data={monthly} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleKamar;