/* eslint-disable react/prop-types */
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import { GeneralContext } from '../../App';
import { useContext } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 80,
  },
  {
    field: 'unitPrice',
    headerName: 'Price per item',
    width: 120,
  },
  {
    field: 'totalPrice',
    headerName: 'Total Price',
    width: 120,
  },
  // {
  //   field: 'remaining',
  //   headerName: 'Remaining',
  //   width: 80,
  // },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    width: 70,
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
  marginTop: '20px',
  color: 'inherit'
}

var rows = [];

export default function ResourcesTable({data}) {
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
};

// Table actions
const TableActions = ({parameters}) => {
  const { handleOpenModal, setDetailsFormType, setDetailsData } = useContext(GeneralContext);

  return (
    <Box>
      <Tooltip title='View / Edit'>
        <IconButton onClick={() => {
            handleOpenModal(); 
            setDetailsFormType('resource');
            setDetailsData(parameters.row);
          }}>
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
};