import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { BarChart } from '@mui/x-charts/BarChart';


const valueFormatter = (value) => `${value.toFixed(2)} USD`;

export default function DividendsReceivedChart({ pid }) {

    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/portfolio/${pid}/dividends/`)
            .then(response => {
                // Convert the data to the required format
                const formattedData = Object.entries(response.data).map(([name, value]) => ({ name, value: parseFloat(value) }));
                setData(formattedData);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [pid]);

    return (
        <div>
            {Array.isArray(data) && data.length > 0 ? (
                <>
                <h4 style={{ color: "white" }}>Dividends Received</h4>
                <BarChart
                    margin={{ top: 30 }}
                    dataset={data}
                    xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                    series={[{ dataKey: 'value', label: 'Dividends Received', valueFormatter, color: '#2c7bf2', }]}
                    height={450}
                    slotProps={{ legend: { hidden: true } }}
                    /*slotProps={{
                        legend: {
                            labelStyle: {
                                fontSize:18,
                                fill: 'white',
                                fontWeight: 'bold',
                            },
                        }
                    }} */
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
                </>
            ) : (
                <p>No Data Available</p>
            )}
        </div>
    );
}