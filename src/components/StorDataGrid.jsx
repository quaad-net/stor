import { DataGrid } from '@mui/x-data-grid';
import './StorDataGrid.css';
import {CustomNoRowsOverlay} from './GridOverlayHeight.jsx'; //  { GridOverlayHeight }


// const exampleData = {
//   rows: [
//       { id: 1, col1: 'val', col2: 'val' },
//       { id: 2, col1: 'val', col2: 'val' },
//       { id: 3, col1: 'val', col2: 'val' },
//     ],
//   columns: [
//   { field: 'col1', headerName: 'Column 1', width: 150 },  // Note: headerName is simply how you want the field name to appear.
//   { field: 'col2', headerName: 'Column 2', width: 150 },
//   ]
// }

function StorDataGrid(props) {

  // if nowRows, DataGrid props include:
  // slots={{ noRowsOverlay: CustomNoRowsOverlay }}
  // sx={{ '--DataGrid-overlayHeight': '300px' }}
  // rows={[]}
  const noRows = props.rows.length < 1;
  return (
      <div className='stor-datagrid-container'>
        <div id='stor-datagrid' style={{ height: 400, width: '100%' }}>
          <DataGrid 
            {...(noRows ? {
                  slots:{ noRowsOverlay: CustomNoRowsOverlay, 
                  sx: {'--DataGrid-overlayHeight': '300px'}  }} : {}
                )
            }
            rows={ noRows ? [] : props.rows}
            columns={noRows ? []: props.columns} 
          />
        </div>
      </div>
    )
}

export default StorDataGrid;