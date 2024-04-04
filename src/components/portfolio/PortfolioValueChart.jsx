import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function PortfolioValueChart({ pid }) {

    const [data, setData] = useState([]);
    const [dataPoints, setDataPoints] = useState(null);

    useEffect(() => {
        const getPortfolioValue = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/portfolio/${pid}/portfoliovalue/`);
                const data = response.data;
                const dataArray = Object.keys(data).map(date => ({
                    date: new Date(date),
                    price: data[date],
                }));
                setData(dataArray);
            } catch (error) {
                console.error(error);
            }
        };

        getPortfolioValue();
    }, [pid]);

    const handleButtonClick = (points) => {
        setDataPoints(points);
    };

    return (
        <div>
            {data.length > 0 ? (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ color: "white" }}>Portfolio Value</h4>
                        <ButtonGroup size="small" variant="text" aria-label="text small button group">
                            <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(7)}>7D</Button>
                            <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(90)}>3M</Button>
                            <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(365)}>1Y</Button>
                            <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(1825)}>5Y</Button>
                            <Button sx={{ '&:focus': { outline: 'none' } }} onClick={() => handleButtonClick(data.length)}>All</Button>
                        </ButtonGroup>
                    </div>
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
                                label: 'Value',
                                curve: 'linear',
                                showMark: false,
                                color: '#edb847',
                                valueFormatter: (value) => `${Number(value).toFixed(2)} USD`,
                            },
                        ]}
                        dataset={dataPoints ? data.slice(-dataPoints) : data}
                        height={450}
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
            ) : (
                <p>No Data Available</p>
            )}
        </div>
    );
}