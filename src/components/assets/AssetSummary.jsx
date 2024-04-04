import { Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssetSummary = ({ symbol }) => {
    const [assetData, setAssetData] = useState(null);

    useEffect(() => {
        const getAssetSummary = async () => {
            try {
                const response = await axios.get('http://localhost:8000/public/asset/summary/', { params: { symbol } });
                const data = response.data;
                setAssetData(data);

            } catch (error) {
                console.error(error);
            }
        };
        getAssetSummary();
    }, [symbol]);

    return (
        <Grid container spacing={1}>
            {assetData && (
                <>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Valuation Metrics</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Trailing P/E:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.trailingPE).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Forward P/E:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.forwardPE).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Trailing EPS:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.trailingEps).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Forward EPS:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.forwardEps).toFixed(2)}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Growth</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Earnings Growth:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.earningsQuarterlyGrowth * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Revenue Growth:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.revenueGrowth * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Gross Margins:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.grossMargins * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">EBITDA Margins:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.ebitdaMargins * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Operating Margins:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.operatingMargins * 100).toFixed(2)}%</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Forecast</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Target Mean Price:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.targetMeanPrice} USD</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Target High Price:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.targetHighPrice} USD</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Target Low Price:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.targetLowPrice} USD</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">S&P 52-Week Change:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.SandP52WeekChange * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Dividends</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Dividend Rate:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.dividendRate} USD</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Dividend Yield:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.dividendYield * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Payout Ratio:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.payoutRatio * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Trailing Annual Dividend Rate:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.trailingAnnualDividendRate} USD</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Trailing Annual Dividend Yield:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{parseFloat(assetData.trailingAnnualDividendYield * 100).toFixed(2)}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Last Dividend Value:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.lastDividendValue} USD</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Risk</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Beta:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.beta}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Audit Risk:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.auditRisk}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Board Risk:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.boardRisk}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Compensation Risk:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.compensationRisk}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Shareholder Rights Risk:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.shareHolderRightsRisk}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="#89949d">Overall Risk:</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <Typography variant="body2">{assetData.overallRisk}</Typography>
                    </Grid>

                </>
            )}
        </Grid>
    );
};

export default AssetSummary;