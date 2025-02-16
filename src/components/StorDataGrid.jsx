import { DataGrid } from '@mui/x-data-grid';
import './StorDataGrid.css';
import {CustomNoRowsOverlay, GridOverlayHeight} from './GridOverlayHeight.jsx';


// const myTestData = {
//   rows: [
//       { id: 1, col1: 'Hello', col2: 'World' },
//       { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//       { id: 3, col1: 'MUI', col2: 'is Amazing' },
//     ],
//   noRows: [],
//   columns: [
//   { field: 'col1', headerName: 'Column 1', width: 150 },
//   { field: 'col2', headerName: 'Column 2', width: 150 },
//   ]
// }

function StorDataGrid(props) {

  // if nowRows, DataGrid props include:
  // slots={{ noRowsOverlay: CustomNoRowsOverlay }}
  // sx={{ '--DataGrid-overlayHeight': '300px' }}
  // rows={[]}

  // When using test data, replace "props.rows" with props.noRows" in noRows def below to view table
  // retured with no records (const noRows = props.noRows.length < 1).
  const noRows = props.noRows.length < 1;
  return (
      <div className='StorDataGridContainer'>
        <div id='StorDataGrid' style={{ height: 300, width: '100%' }}>
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