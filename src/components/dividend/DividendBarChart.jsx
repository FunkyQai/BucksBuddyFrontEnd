import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function DividendBarChart({ dividendData }) {

  const [itemNb, setItemNb] = useState(5);

  let dataX = [];
  let dataY = [];
  if (dividendData) {
    const entries = Object.entries(dividendData)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => [new Date(key).getFullYear(), Number(value)]);

    const groupedData = entries.reduce((acc, [year, value]) => {
      acc[year] = (acc[year] || 0) + value;
      return acc;
    }, {});

    dataX = Object.keys(groupedData);
    dataY = Object.values(groupedData);
  }

  return (
    <div>
      <h4 style={{ color: "white", marginBottom:"20px"}}>Payout History</h4>
      <ButtonGroup size="small" variant="text" aria-label="text small button group">
        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => setItemNb(3)}>3Y</Button>
        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => setItemNb(5)}>5Y</Button>
        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => setItemNb(10)}>10Y</Button>
        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => setItemNb(dataY.length)}>All</Button>
      </ButtonGroup>
      {dataY.length > 0 &&
        <BarChart
          xAxis={[{
            data: dataX.map(Number).slice(-itemNb),
            scaleType: 'band',
            valueFormatter: (year) => year.toString(),
          }]}
          series={[
            {
              data: dataY.slice(-itemNb),
              label: 'Dividends ($)',
              color: '#4692c3',
            },
          ]}
          height={400}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            //Remove ticks on both axes
            ".MuiChartsAxis-tick": {
              strokeWidth: 0,
            },
            // change bottom label styles
            " .MuiChartsAxis-tickLabel": {
              fill: "#89949d !important",
            },
            // bottomAxis Line 
            "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
              strokeWidth: 0
            },
            // leftAxis Line 
            "& .MuiChartsAxis-left .MuiChartsAxis-line": {
              strokeWidth: 0
            },
          }}
        />
      }

    </div>
  );
}

export default DividendBarChart;