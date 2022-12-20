// import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { publicRequest } from "../../requestMethods";
import { useEffect, useState } from "react";

const Widget = ({ type, stats }) => {
  let dataa;
  const [income, setIncome] = useState([]);
  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await publicRequest.get("/kamars/income");
        res.data.sort((a, b) => {
          return b._id - a._id
        })
        setIncome(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getStats();
  }, [])

  const profit = (income[0]?.monthlyMoney / income[1]?.monthlyMoney) * 100;

  switch (type) {
    case "warehouse":
      dataa = {
        title: "WAREHOUSE",
        isMoney: false,
        link: "See all users",
        amount: stats[0]?.totalSoni,
        icon: (
          <ShoppingCartOutlinedIcon
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "money_in_warehouse":
      dataa = {
        title: "MONEY IN WAREHOUSE",
        isMoney: true,
        link: "View all orders",
        amount: stats[0]?.totalMoney,
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      dataa = {
        title: "MONTHLY EARNING",
        isMoney: true,
        link: "View net earnings",
        amount: income[0]?.monthlyMoney,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      dataa = {
        title: "Number of Belts",
        isMoney: false,
        amount: stats[0]?.count,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (

    <div className="bg-white h-40 p-4 pt-9 rounded-2xl shadow-lg m-2 mr-6 flex justify-between">
      <div className="flex flex-col">
        <span className="text-lg font-bold">{dataa.title}</span>
        <span className="text-2xl font-light">
          {dataa?.amount}  {dataa.isMoney ? "sum" : "ta"}
        </span>
        <span className="text-base">{dataa.link}</span>
      </div>
      <div className="flex items-end pb-4 pr-4">
        {dataa.icon}
      </div>
    </div>
  );
};

export default Widget;
