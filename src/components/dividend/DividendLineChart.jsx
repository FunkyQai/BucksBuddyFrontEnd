import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';


function DividendLineChart({ dividendData }) {

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
            {dataY.length > 0 &&
                <LineChart
                    xAxis={[{
                        data: dataX.map(Number),
                        scaleType: 'time',
                        valueFormatter: (year) => year.toString(),
                    }]}
                    series={[
                        {
                            curve: 'linear',
                            data: dataY,
                            showMark: false,
                            label: 'Dividends ($)',
                            color: '#4692c3',
                        },
                    ]}
                    width={400}
                    height={250}
                    leftAxis={null}
                    bottomAxis={null}
                    slotProps={{ legend: { hidden: true } }}
                    sx={{
                        "& .MuiChartsAxisHighlight-root": {
                            stroke: 'white !important',
                            strokeWidth: 1,
                        },
                        "& .MuiChartsTooltip-root": {
                            backgroundColor: "white",
                            color: "white"
                        },
                    }}
                />
            }
        </div>
    );
}

export default DividendLineChart;