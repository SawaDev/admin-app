import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar'
import { publicRequest } from '../../requestMethods';

const SingleCustomer = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const path = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState()

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const res = await publicRequest.get('/customers/find/' + id);
        setCustomer(res.data);
        setLoading(false);
      } catch (err) {
        alert(err.message);
      }
    }
    getCustomer();
  }, [])

  const columns = [
    {
      field: "ketdi",
      headerName: "Olindi",
      width: "150",
    },
    {
      field: "formattedSingleSale",
      headerName: "Amount",
      width: "200",
    },
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
    {
      field: "price",
      headerName: "Price",
      width: "120"
    },
    {
      field: "size",
      headerName: "Size",
      width: "120"
    },
    {
      field: "category",
      headerName: "Category",
      width: "120"
    },
    {
      field: "color",
      headerName: "Color",
      width: "120"
    },
    {
      field: "temir",
      headerName: "Temir",
      width: "120"
    },

  ];

  if (loading) {
    return "Loading...";
  }

  return (
    <div className='realtive'>
      <div className="fixed bg-main-bg navbar w-full">
        <Navbar />
      </div>

      <div className="datatable pt-20">
        <div className="datatableTitle mt-8 px-3">
          <div className='text-black font-semibold'>Customer: <span>{customer?.name}</span></div>
          <div className='text-black font-semibold'>Total Sale: <span>{customer?.formattedTotalSales}</span></div>
        </div>
        <DataGrid
          className="datagrid"
          rows={customer && customer.sales}
          columns={columns}
          pageSize={9}
          rowsPerPageOptions={[9]}
          // checkboxSelection
          getRowId={(row) => row.kamarId}
        />
      </div>
    </div>
  )
}

export default SingleCustomer