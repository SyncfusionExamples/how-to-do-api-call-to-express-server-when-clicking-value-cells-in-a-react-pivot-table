import { DrillThrough, PivotViewComponent, Inject } from '@syncfusion/ej2-react-pivotview';
import * as React from 'react';
import './App.css';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import axios from 'axios';
import {useState} from 'react';

let pivotData = [
  {
    Sold: 31,
    Amount: 52824,
    Country: 'France',
    Products: 'Mountain Bikes',
    Year: 'FY 2015',
    Quarter: 'Q1',
  },
  {
    Sold: 51,
    Amount: 86904,
    Country: 'France',
    Products: 'Mountain Bikes',
    Year: 'FY 2016',
    Quarter: 'Q2',
  },
  {
    Sold: 20,
    Amount: 153360,
    Country: 'India',
    Products: 'Mountain Bikes',
    Year: 'FY 2015',
    Quarter: 'Q3',
  },
  {
    Sold: 25,
    Amount: 42600,
    Country: 'India',
    Products: 'Mountain Bikes',
    Year: 'FY 2016',
    Quarter: 'Q4',
  },
  {
    Sold: 45,
    Amount: 46008,
    Country: 'Germany',
    Products: 'Mountain Bikes',
    Year: 'FY 2015',
    Quarter: 'Q1',
  },
  {
    Sold: 76,
    Amount: 121258,
    Country: 'Germany',
    Products: 'Touring Bikes',
    Year: 'FY 2016',
    Quarter: 'Q4',
  },
];

function App() {
  let pivotObj;

  // State initialization for holding data source
  const [datas, setDatas] = useState(pivotData);
  let dataSourceSettings = {
    enableSorting: true,
    columns: [{ name: 'Year' }],
    valueSortSettings: { headerDelimiter: ' - ' },
    values: [{ name: 'Sold', caption: 'Units Sold' }],
    dataSource: datas,
    rows: [{ name: 'Country' }],
    formatSettings: [{ name: 'Amount', format: 'C0' }],
    expandAll: true,
    showGrandTotals: false,
    showSubTotals: false,
    filters: [],
  };

  // The event handler for cell clicks
  async function cellSelecting(args) {
    if (args.data.axis == 'value') {
      let data = args.data;
      // POST request to your server
      const response = await fetch("http://localhost:5000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Passed the cell information and data source to the server here.
        body: JSON.stringify({ data, pivotData: datas }),
      })
      // Get the response from the server here. Here we returned updated data as a response.
      const res = await response.json();
      // Assign the updated data to the pivot table.
      pivotObj.dataSourceSettings.dataSource = res;
      // Also update the state variable in which the data is stored.
      setDatas(res);
    } else{
      // Cancel cell click event for non-value cells(i.e., row and column headers)
      args.cancel = true;
    }
  }


return (
  <div className="control-pane">
    <div className="control-section" style={{ overflow: 'auto', margin: '20px' }}>
    <PivotViewComponent
          id="PivotView"
          showTooltip={false}
          ref={(scope) => {
            pivotObj = scope;
          }}
          dataSourceSettings={dataSourceSettings}
          width={'90%'}
          height={'290'}
          gridSettings={{
            columnWidth: 140,
            allowSelection: true,
            allowResizing: true,
            selectionSettings: { mode: 'Cell', type: 'Single' },
            clipMode: 'EllipsisWithTooltip',
          }}
          cellClick={cellSelecting.bind(this)}
          allowDrillThrough={true}
        >
          <Inject services={[DrillThrough]} />
        </PivotViewComponent>
    </div>
  </div>
);
}

export default App;
