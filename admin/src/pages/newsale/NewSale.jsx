import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { publicRequest, userRequest } from '../../requestMethods';
import { useNavigate } from 'react-router-dom';

const NewSale = () => {
  const [customers, setCustomers] = useState([]);
  const [kamars, setKamars] = useState([]);
  const [kamarId, setKamarId] = useState("");
  const [sale, setSale] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const res = await publicRequest.get('/customers');
        const kamar = await publicRequest.get('/kamars');
        setCustomers(res.data);
        setKamars(kamar.data);
      } catch (err) {
        alert(err.message);
      }
    }
    getCustomers();
  }, [])

  const handleFilters = (e) => {
    const value = e.target.value;
    setSale({
      ...sale,
      kamarId,
      [e.target.name]: value,
    });
    console.log(sale)
  };

  const handleClick = async (e) => {
    try {
      await userRequest.post('/sales', sale);
      navigate('/customers');
    } catch (err) {
      alert(err.message);
    }

  }

  return (
    <div className='relative w-full'>
      <div className="fixed bg-main-bg navbar w-full">
        <Navbar />
      </div>
      <div className='max-w-7xl mx-auto pt-[100px] flex items-center flex-col'>
        <span className="text-gray-600 text-3xl mb-6">Here you can add new sale: </span>
        <div className='flex gap-5 p-4 pl-0 flex-wrap justify-center'>
          <div className='flex flex-col'>
            <label className="text-lg font-semibold mb-2">Choose Kamar: </label>
            <input
              placeholder="Kamar"
              onChange={(event) => {
                const selectedKamar = kamars.find((k) => {
                  return `${k?.size}, ${k?.color}, ${k?.category}, ${k?.temir} temir` === event.target.value;
                });
                if (selectedKamar) {
                  setKamarId(selectedKamar._id);
                }
              }}
              type="text"
              required
              list='kamars'
              className="p-3 bg-gray-100 rounded-lg min-w-[320px] "
            />
            <datalist id="kamars">
              {kamars.map((k) => (
                <option key={k._id} value={`${k?.size}, ${k?.color}, ${k?.category}, ${k?.temir} temir`} />
              ))}
            </datalist>
          </div>
          <div className='flex flex-col'>
            <label className="text-lg font-semibold mb-2">Select Customer: </label>
            <input
              placeholder="Customer Name"
              name="customerName"
              onChange={handleFilters}
              type="text"
              list='customers'
              className="p-3 bg-gray-100 rounded-lg min-w-[320px] "
            />
            <datalist id="customers">
              {customers.map((c) => (
                <option key={c._id} value={c?.name} />
              ))}
            </datalist>
          </div>
          <div className='flex flex-col'>
            <label className="text-lg font-semibold mb-2">Count of Kamars: </label>
            <input
              placeholder="Count"
              name="ketdi"
              onChange={handleFilters}
              type="number"
              min="0" step="any"
              className="p-3 bg-gray-100 rounded-lg min-w-[320px] "
            />
          </div>
          <button onClick={handleClick} type="button" className="w-40 mt-8 p-3 justify-start bg-teal-600 rounded text-white font-bold cursor-pointer">Add Sale</button>
        </div>
      </div>
    </div>
  )
}

export default NewSale