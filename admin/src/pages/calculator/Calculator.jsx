import { useState } from "react"
import Navbar from "../../components/navbar/Navbar"
import "./calculator.scss"

function Calculator() {

  const [soni, setSoni] = useState(0);
  const [price, setPrice] = useState(0);
  const [price_in_dollar, setPrice_in_dollar] = useState(0);
  const [dollar_kurs, setDollar_kurs] = useState(0);
  const [result, setResult] = useState();

  function handleClick() {
    setResult(price * soni - price_in_dollar * dollar_kurs * soni);
  };

  return (
    <div>
      <div>
        <Navbar />
        <div className="flex h-full justify-center p-5 items-center">
          <form className="">
            <div className="text-gray-500 text-xl mb-6">Here you can calculate your profit: </div>
            <div className="flex flex-row flex-wrap gap-4 justify-between">
              <div className="w-2/5">
                <label className="text-lg mb-2"> Price: </label>
                <input
                  placeholder={price}
                  onChange={e => setPrice(e.target.value)}
                  type="number"
                  className="p-2 bg-gray-100 w-full"
                />
              </div>
              <div className="w-2/5">
                <label className="text-lg mb-2"> In dollar </label>
                <input
                  placeholder={price_in_dollar}
                  onChange={e => setPrice_in_dollar(e.target.value)}
                  type="number"
                  min="0" step="any"
                  className="p-2 bg-gray-100 w-full"
                />
              </div>
              <div className="w-2/5">
                <label className="text-lg mb-2"> Dollar Kursi</label>
                <input
                  placeholder={dollar_kurs}
                  onChange={e => setDollar_kurs(e.target.value)}
                  type="number"
                  className="p-2 bg-gray-100 w-full"
                />
              </div>
              <div className="w-2/5">
                <label className="text-lg mb-2"> Soni: </label>
                <input
                  placeholder={soni}
                  onChange={e => setSoni(e.target.value)}
                  type="number"
                  className="p-2 bg-gray-100 w-full"
                />
              </div>

            </div>
            <button type="button" className="w-40 mt-8 p-3 justify-start bg-teal-600 rounded text-white font-bold cursor-pointer" onClick={handleClick}>Calculate</button>

            <h1 className="my-8 text-black text-2xl"> Your profit is: {result}</h1>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Calculator