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
    width: 130,
  },
  {
    field: 'used',
    headerName: 'Used',
    width: 130,
  },
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
  height: '300px',
  background: 'white',
  marginTop: '20px' 
}

var rows = [];

export default function SprintResourcesTable(props) {
  const { data } = props;
  rows = data;

  return (
    <Box sx={TableStyles}>
      <DataGrid
        rowHeight={30}
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
  const { setSelectedMaterial } = useContext(GeneralContext);

  return (
    <Box>
      <Tooltip title='View / Edit'>
        <IconButton onClick={() => {
            setSelectedMaterial(parameters.row);
          }}>
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
};