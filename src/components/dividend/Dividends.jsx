import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Card, Grid } from '@mui/material';
import DisplayError from '../DisplayError';
import DividendLineChart from './DividendLineChart';
import DividendTable from './DividendTable';
import DividendBarChart from './DividendBarChart';
import DividendYieldChart from './DividendYieldChart';



export default function Dividends({ symbol }) {

    const [dividendData, setdividendData] = useState(null);
    const [assetData, setAssetData] = useState(null);

    useEffect(() => {
        const getDividendInfo = async () => {
            try {
                const response1 = await axios.get('http://localhost:8000/public/asset/dividend/', { params: { symbol } });
                const data1 = response1.data;
                setdividendData(data1);

                const response2 = await axios.get('http://localhost:8000/public/asset/dividend/summary/', { params: { symbol } });
                const data2 = response2.data;
                setAssetData(data2);

            } catch (error) {
                console.error(error);
            }
        };

        if (symbol) {
            getDividendInfo();
        }
    }, [symbol]);

    return (
        <div>
            {assetData && Object.keys(dividendData).length > 0 ? (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card sx={{ backgroundColor: "#32323e", borderRadius: "8px", padding: "3%" , paddingBottom:"0"}}>
                            <Grid container>
                                <Grid container item xs={12} sm={8}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="#89949d">Dividend Rate:</Typography>
                                        <Typography variant="h6" color="white">{assetData.dividendRate} USD</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="#89949d">Dividend Yield:</Typography>
                                        <Typography variant="h6" color="white">{parseFloat(assetData.dividendYield * 100).toFixed(2)}%</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="#89949d">Payout Ratio:</Typography>
                                        <Typography variant="h6" color="white">{parseFloat(assetData.payoutRatio * 100).toFixed(2)}%</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="#89949d">Trailing Annual Dividend Rate:</Typography>
                                        <Typography variant="h6" color="white">{assetData.trailingAnnualDividendRate} USD</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="#89949d">Trailing Annual Dividend Yield:</Typography>
                                        <Typography variant="h6" color="white">{parseFloat(assetData.trailingAnnualDividendYield * 100).toFixed(2)}%</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="#89949d">Last Dividend Value:</Typography>
                                        <Typography variant="h6" color="white">{assetData.lastDividendValue} USD</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <DividendLineChart dividendData={dividendData} />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                        <Card sx={{ backgroundColor: "#32323e", borderRadius: "8px", padding: "3%" }}>
                            <DividendBarChart dividendData={dividendData} />
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <Card sx={{ backgroundColor: "#32323e", borderRadius: "8px" }}>
                            <DividendTable dividendData={dividendData} />
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card sx={{ backgroundColor: "#32323e", borderRadius: "8px", padding: "3%" }}>
                            <DividendYieldChart symbol={symbol} />
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                    <DisplayError />
            )}
        </div>
    );
}

