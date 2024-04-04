import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';


export default function PriceHistoryChart({ symbol }) {

    const [priceHistoryData, setPriceHistoryData] = useState(null);
    const [dataPoints, setDataPoints] = useState(null);

    useEffect(() => {
        const getPriceHistory = async () => {
            try {
                const response = await axios.get('http://localhost:8000/public/asset/price-history/', { params: { symbol } });
                const data = response.data;
                // Transform the data into the correct format
                const transformed = Object.entries(data.Close).map(([date, price]) => ({
                    date: new Date(date),
                    price
                }));

                setPriceHistoryData(transformed);

            } catch (error) {
                console.error(error);
            }
        };

        getPriceHistory();
    }, [symbol]);

    const handleButtonClick = (points) => {
        setDataPoints(points);
    };

    return (
        <div>
            {priceHistoryData && (
                <div>
                    <ButtonGroup size="small" variant="text" aria-label="text small button group">
                        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(7)}>7D</Button>
                        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(90)}>3M</Button>
                        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(365)}>1Y</Button>
                        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(1825)}>5Y</Button>
                        <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(priceHistoryData.length)}>All</Button>
                    </ButtonGroup>
                    <LineChart
                        xAxis={[
                            {
                                dataKey: 'date',
                                scaleType: 'time',
                                valueFormatter: (date) => new Date(date).toLocaleDateString('en-GB'),
                            },
                        ]}
                        series={[
                            {
                                dataKey: 'price',
                                label: 'Price',
                                curve: 'linear',
                                showMark: false,
                                color: '#4692c3',
                                valueFormatter: (value) => Number(value).toFixed(2),
                            },
                        ]}
                        dataset={priceHistoryData.slice(-dataPoints)}
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
                </div>
            )}
        </div>
    );
}