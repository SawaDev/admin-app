import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import { publicRequest } from '../../requestMethods'

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const res = await publicRequest.get('/customers');
        setCustomers(res.data);
      } catch (err) {
        alert(err.message);
      }
    }
    getCustomers();
  }, [])

  const columns = [
    {
      field: "name",
      headerName: "Customer",
      width: "200",
    },
    {
      field: "sales",
      headerName: "Total Sales",
      width: "200",
      renderCell: (params) => {
        const count = params.row.sales.length;
        return (
          <div className="cellDay">
            <div className="day">{count}</div>
          </div>
        );
      },
    },
    {
      field: "formattedTotalSales",
      headerName: "Total Sales",
      width: "240"
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/customers/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="list">
      <div className="listContainer">
        <div className="fixed bg-main-bg navbar w-full">
          <Navbar />
        </div>
        <div className="datatable mt-20">
          <div className="datatableTitle">
            Customers
          </div>
          <DataGrid
            className="datagrid"
            rows={customers}
            columns={columns}
            pageSize={9}
            rowsPerPageOptions={[9]}
            // checkboxSelection
            getRowId={(row) => row._id}
          />
        </div>
      </div>
    </div>
  )
}

export default Customers