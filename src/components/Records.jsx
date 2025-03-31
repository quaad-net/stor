// Viewing component for database records.

import StorDataGrid from './StorDataGrid';

// Test data
const myTestData = {
  rows: [
      { id: 1, col1: 'Hello', col2: 'World' },
      { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
      { id: 3, col1: 'MUI', col2: 'is Amazing' },
    ],
  noRows: [],
  columns: [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
  ]
}

export default function Records(){
  return(
      <>
          <StorDataGrid {...myTestData}/>
          {/* {records} */}
      </>
  )

}