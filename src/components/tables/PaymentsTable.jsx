/* eslint-disable react/prop-types */
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Tooltip } from '@mui/material';
import axios from 'axios';
import { useContext } from 'react';
import { GeneralContext } from '../../App';
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;

const columns = [
  {
    field: 'description',
    headerName: 'Description',
    width: 250,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 90,
  },
  {
    field: 'currency',
    headerName: 'Currency',
    width: 90,
  },
  {
    field: 'user',
    headerName: 'Payee',
    width: 150,
  },
  {
    field: 'entryDate',
    headerName: 'Date of payment',
    width: 200,
  },
  {
    field: 'approved',
    headerName: 'Approved',
    width: 80,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    width: 200,
    renderCell: (params) => <TableActions parameters= {params} />
  },
]

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export const TableStyles = {
  padding: '0px',
  width: '100%',
  height: '400px',
  background: '#97cadb',
  color: 'inherit'
}

var rows = [];

export default function PaymentsTable({data}) {
  rows = data;

  return (
    <Box sx={TableStyles}>
      <DataGrid
        rowHeight={38}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[20]}
        disableSelectionOnClick
        experimentalFeatures={{newEditingApi: true}}
        components={{Toolbar: CustomToolbar}}
      />
    </Box>
  );
}

const buttonStyles = {
  border: '0px',
  background: 'transparent',
  color: 'blue',
  fontSize: '100%',
  cursor: 'pointer'
}

// Table actions
const TableActions = ({parameters}) => {
  const { setOpen, setResponseMessage } = useContext(GeneralContext);

  const updatePaymentStatus = (e) => {
    e.preventDefault();
    
    axios.put(`${serverUrl}/api/v1/mppms/payment/update?id=${parameters.row.id}`, { approved: true })
    .then(response => {
      if (response.status === 200) {
        setResponseMessage({ message: response.data.message, severity:'success'})
        setOpen(true);
        setTimeout(() => {
          window.location.reload();
        },1500);
      }
    })
    .catch(error => {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setResponseMessage({ message: error.response.data.msg, severity:'error'})
        setOpen(true);
      }
    })
  }

  return (
    <Box>
      <Tooltip title='Approve'>
        <button style={buttonStyles} onClick={updatePaymentStatus}>Approve</button>
      </Tooltip>
    </Box>
  )
};