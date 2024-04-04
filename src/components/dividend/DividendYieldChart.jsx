import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';


function DividendYieldChart({ symbol }) {

    const [dividendData, setdividendData] = useState(null);

    useEffect(() => {
        const getDividendYield = async () => {
            try {
                const response = await axios.get('http://localhost:8000/public/asset/dividend/yield/', { params: { symbol } });
                const data = response.data;
                const filteredData = data.map(dataPoint => ({
                    Date: new Date(dataPoint.Date).getTime(),
                    Yield: Number(dataPoint.Yield),
                })).filter(dataPoint => !isNaN(dataPoint.Date) && !isNaN(dataPoint.Yield));
                // Set the data as a state
                setdividendData(filteredData);

            } catch (error) {
                console.error(error);
            }
        };

        getDividendYield();
    }, [symbol]);

    return (
        <div>
            <h4 style={{ color: "white" }}>Dividend Yield</h4>
            {dividendData &&
                <LineChart
                    xAxis={[
                        {
                            dataKey: 'Date',
                            scaleType: 'time',
                            valueFormatter: (date) => new Date(date).toLocaleDateString('en-GB'),
                        },
                    ]}
                    series={[
                        {
                            dataKey: 'Yield',
                            label: 'Dividend Yield (%)',
                            curve: 'linear',
                            showMark: false,
                            color: '#4692c3',
                            valueFormatter: (value) => Number(value).toFixed(2),
                        },
                    ]}
                    dataset={dividendData}
                    height={300}
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
                            stroke: "#41454e",
                            strokeWidth: 2
                        },
                        // leftAxis Line 
                        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                            strokeWidth: 0
                        },
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

export default DividendYieldChart;