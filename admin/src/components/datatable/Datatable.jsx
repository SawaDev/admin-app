import "./datatable.scss";
import api from '../../api';
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import millify from 'millify';
import { useDispatch, useSelector } from "react-redux";
import { deleteKamar, getKamars } from "../../redux/apiCalls"

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState();

  //Kurs uchun 
  const [value, setValue] = useState(1);
  const [convertedValue, setConvertedValue] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [base, setBase] = useState('USD');
  const [symbol, setSymbol] = useState('UZS');

  //redux 
  const dispatch = useDispatch();
  const kamars = useSelector((state) => state.kamar.kamars)

  useEffect(() => {
    getKamars(dispatch);
  }, [dispatch])

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
    setList(kamars);
  }, [kamars]);

  const handleDelete = (id) => {
    deleteKamar(id, dispatch);
  };

  const incomeColumn = [
    {
      field: "income",
      headerName: "Income",
      width: "100",
      renderCell: (params) => {
        return (
          <div className="cellIncome">
            <div className="income">{millify(params.row.price * params.row.soni)}</div>
          </div>
        );
      },
    },
  ];

  const dateColumn = [
    {
      field: "createdAt",
      headerName: "Day",
      width: "120",
      renderCell: (params) => {
        const day = (params.row.createdAt).split("T")[0];
        return (
          <div className="cellDay">
            <div className="day">{day}</div>
          </div>
        );
      },
    },
  ];

  const profitColumn = [
    {
      field: "profit",
      headerName: "Profit",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellProfit">
            <div className="profit">{millify(params.row.price * params.row.soni - convertedValue * params.row.price_in_dollar * params.row.soni)}</div>
          </div>
        );
      },
    }
  ]

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/${path}/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable mt-20">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={kamars}
        columns={columns.concat(dateColumn, incomeColumn, profitColumn, actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;