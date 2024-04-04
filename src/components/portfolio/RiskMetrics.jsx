import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Grid, Box } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import Plot from 'react-plotly.js';

const HTMLTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));


export default function RiskMetrics({ pid }) {

    const [metrics, setMetrics] = useState();
    const [spmetrics, setSPMetrics] = useState();
    const [data, setData] = useState(); //Matrix data
    const [labels, setLabels] = useState();
    const [values, setValues] = useState();

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const spResponse = await axios.get(`http://localhost:8000/portfolio/spmetrics/`);
                setSPMetrics(spResponse.data);

                const portfolioResponse = await axios.get(`http://localhost:8000/portfolio/${pid}/portfoliometrics/`);
                setMetrics(portfolioResponse.data);

                const data = portfolioResponse.data["Correlation Matrix"];
                setData(data);
                const labels = Object.keys(data);
                setLabels(labels);
                const values = labels.map(label => labels.map(l => data[label][l]));
                setValues(values);
            } catch (error) {
                console.error('Error fetching metrics!', error);
            }
        };

        fetchMetrics();
    }, [pid]);

    return (
        <>
            {metrics && spmetrics && (
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Card sx={{ padding: "2%", backgroundColor: "#32323e", color: "white", borderRadius: "8px", height: "200px" }}>
                            <CardContent>
                                <h5>Expected Annual Returns{' '}
                                    <HTMLTooltip title="Annual Expected Returns estimate the average return an investor can expect from an investment over a one-year period, based on historical data. It is calculated as the average of historical returns over the past 5 years. Expected returns provide insight into the investment's past performance and potential future behavior." >
                                        <HelpOutlineIcon sx={{ fontSize: 'small' }} />
                                    </HTMLTooltip>
                                </h5>
                                <p style={{ fontSize: '0.8em', color: '#89949d' }}>Projected average gains from investments over a one-year period.</p>
                                <Grid container spacing={0}>
                                    <Grid item xs={4}>
                                        <Card sx={{ backgroundColor: "#282832", color: "white", borderRadius: "8px 0 0 8px", height: "80px", borderRight: '1px solid white' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <h3>{metrics["Expected Annual Return"]}%</h3>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card sx={{ backgroundColor: "#282832", color: "white", borderRadius: "0 8px 8px 0", height: "80px", borderLeft: '1px solid white' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingBottom: '0' }}>
                                                <h3>{spmetrics["Expected Annual Return"]}%</h3>
                                                <p style={{ color: '#89949d', position: 'absolute', bottom: '5%', right: '5%', fontSize: '0.6em', margin: '0', padding: '0' }}>S&P 500</p>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card sx={{ padding: "2%", backgroundColor: "#32323e", color: "white", borderRadius: "8px", height: "200px" }}>
                            <CardContent>
                                <h5>Annual Volatility{' '}
                                    <HTMLTooltip title="Annual Volatility quantifies the degree of variation in an investment's returns over a one-year period. It is calculated as the standard deviation of returns over the specified historical period. Higher volatility implies greater potential for large price swings, both up and down. The calculation is based off 5 years of historical data." >
                                        <HelpOutlineIcon sx={{ fontSize: 'small' }} />
                                    </HTMLTooltip>
                                </h5>
                                <p style={{ fontSize: '0.8em', color: '#89949d' }}>Measures return fluctuation over a year</p>
                                <Grid container spacing={0}>
                                    <Grid item xs={4}>
                                        <Card sx={{ backgroundColor: "#282832", color: "white", borderRadius: "8px 0 0 8px", height: "80px", borderRight: '1px solid white' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <h3>{metrics["Annual Volatility"]}%</h3>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card sx={{ backgroundColor: "#282832", color: "white", borderRadius: "0 8px 8px 0", height: "80px", borderLeft: '1px solid white' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingBottom: '0' }}>
                                                <h3>{spmetrics["Annual Volatility"]}%</h3>
                                                <p style={{ color: '#89949d', position: 'absolute', bottom: '5%', right: '5%', fontSize: '0.6em', margin: '0', padding: '0' }}>S&P 500</p>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card sx={{ padding: "2%", backgroundColor: "#32323e", color: "white", borderRadius: "8px", height: "300px" }}>
                            <CardContent>
                                <h5>Sharpe Ratio{' '}
                                    <HTMLTooltip title={
                                        <>
                                            <p>The Sharpe Ratio measures the risk-adjusted return of an investment. It is calculated by dividing the excess return of the investment (the return above the risk-free rate) by the standard deviation of returns. A higher Sharpe Ratio indicates better risk-adjusted performance. The calculation is based off 5 years of historical data.</p>
                                            <a href="https://www.investopedia.com/terms/s/sharperatio.asp" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', display: 'block' }}>
                                                More info
                                            </a>
                                        </>
                                    }>
                                        <HelpOutlineIcon sx={{ fontSize: 'small' }} />
                                    </HTMLTooltip>
                                </h5>
                                <p style={{ fontSize: '0.8em', color: '#89949d' }}>Shows the risk-adjusted return of the portfolio. It indicates how much excess return is earned per unit of risk.</p>
                                <div>
                                    {metrics["Sharpe Ratio"] < 0 && <p style={{ color: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)', borderRadius: '8px', padding: '2%', display: 'inline-block', fontSize: '0.8em' }}>Negative or very low risk-adjusted return. 😢</p>}
                                    {metrics["Sharpe Ratio"] >= 0 && metrics["Sharpe Ratio"] < 1 && <p style={{ color: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.1)', borderRadius: '8px', padding: '2%', display: 'inline-block', fontSize: '0.8em' }}>Low to moderate risk-adjusted return. 😐</p>}
                                    {metrics["Sharpe Ratio"] >= 1 && metrics["Sharpe Ratio"] < 2 && <p style={{ color: 'yellow', backgroundColor: 'rgba(255, 255, 0, 0.1)', borderRadius: '8px', padding: '2%', display: 'inline-block', fontSize: '0.8em' }}>Moderate to good risk-adjusted return. 🙂</p>}
                                    {metrics["Sharpe Ratio"] >= 2 && <p style={{ color: 'green', backgroundColor: 'rgba(0, 128, 0, 0.1)', borderRadius: '8px', padding: '2%', display: 'inline-block', fontSize: '0.8em' }}>Excellent risk-adjusted return. 😄</p>}
                                </div>
                                <Grid container spacing={0}>
                                    <Grid item xs={4}>
                                        <Card sx={{ backgroundColor: "#282832", color: "white", borderRadius: "8px 0 0 8px", height: "80px", borderRight: '1px solid white' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <h3>{metrics["Sharpe Ratio"]}</h3>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card sx={{ backgroundColor: "#282832", color: "white", borderRadius: "0 8px 8px 0", height: "80px", borderLeft: '1px solid white' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingBottom: '0' }}>
                                                <h3>{spmetrics["Sharpe Ratio"]}</h3>
                                                <p style={{ color: '#89949d', position: 'absolute', bottom: '5%', right: '5%', fontSize: '0.6em', margin: '0', padding: '0' }}>S&P 500</p>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card sx={{ padding: "2%", backgroundColor: "#32323e", color: "white", borderRadius: "8px", height: "300px" }}>
                            <CardContent>
                                <h5>Sortino Ratio{' '}
                                    <HTMLTooltip title={
                                        <>
                                            <p>The Sortino Ratio measures the risk-adjusted return of an investment, focusing only on downside risk. It is similar to the Sharpe Ratio but considers only the standard deviation of negative returns. A higher Sortino Ratio indicates better risk-adjusted performance, particularly in mitigating downside risk. The calculation is based off 5 years of historical data.</p>
                                            <a href="https://www.investopedia.com/terms/s/sortinoratio.asp" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', display: 'block' }}>
                                                More info
                                            </a>
                                        </>
                                    }>
                                        <HelpOutlineIcon sx={{ fontSize: 'small' }} />
                                    </HTMLTooltip>
                                </h5>
                                <p style={{ fontSize: '0.8em', color: '#89949d' }}>Shows the risk-adjusted return of the portfolio relative to the downside volatility. It helps investors evaluate the return they receive for the amount of downside risk taken.</p>
                                <div>
                                    {metrics["Sortino Ratio"] < 0 && <p style={{ color: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)', borderRadius: '8px', padding: '2%', display: 'inline-block', fontSize: '0.8em' }}>Negative or very low risk-adjusted return, particularly in mitigating downside risk. 😢</p>}
                                    {metrics["Sortino Ratio"] >= 0 && metrics["Sortino Ratio"] < 1 && <p style={{ color: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.1)', borderRadius: '8px', padding: '2%', display: 'inline-block', fontSize: '0.8em' }}>Low to moderate risk-adjusted return, with some consideration to downside risk. 😐</p>}
                                    {metrics["Sortino Ratio"] >= 1 && metrics["Sortino Ratio"] < 2 && <p style={{ color: 'yellow', backgroundColor: 'rgba(255, 255, 0, 0.1)', borderRadius: '8px', padding: '2%', display: 'inline-block', fontSize: '0.8em' }}>Moderate to good risk-adjusted return, emphasizing performance in minimizing downside risk. 🙂</p>}
                                    {metrics["Sortino Ratio"] >= 2 && <p style={{ color: 'green', backgroundColor: 'rgba(0, 128, 0, 0.1)', borderRadius: '8px', padding: '2%', display: 'inline-block', fontSize: '0.8em' }}>Excellent risk-adjusted return, demonstrating strong downside risk management. 😄</p>}
                                </div>
                                <Grid container spacing={0}>
                                    <Grid item xs={4}>
                                        <Card sx={{ backgroundColor: "#282832", color: "white", borderRadius: "8px 0 0 8px", height: "80px", borderRight: '1px solid white' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <h3>{metrics["Sortino Ratio"]}</h3>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Card sx={{ backgroundColor: "#282832", color: "white", borderRadius: "0 8px 8px 0", height: "80px", borderLeft: '1px solid white' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingBottom: '0' }}>
                                                <h3>{spmetrics["Sortino Ratio"]}</h3>
                                                <p style={{ color: '#89949d', position: 'absolute', bottom: '5%', right: '5%', fontSize: '0.6em', margin: '0', padding: '0' }}>S&P 500</p>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <Card sx={{ padding: "0 1% 1% 1%", backgroundColor: "#32323e", color: "white", borderRadius: "8px", height: "520px" }}>
                            <CardContent>
                                <Box display="flex" justifyContent="center">
                                    <Plot
                                        data={[
                                            {
                                                z: values,
                                                x: labels,
                                                y: labels,
                                                type: 'heatmap',
                                                colorscale: 'Cividis',
                                            }
                                        ]}
                                        layout={{
                                            width: 600,
                                            height: 500,
                                            title: 'Correlation between assets',
                                            plot_bgcolor: '#32323e', // Set the background color of the plot area
                                            paper_bgcolor: '#32323e', // Set the background color of the entire chart area
                                            font: {
                                                size: 14,
                                                color: 'white' // Set the font color to white
                                            }
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>                    </Grid>
                </Grid>
            )}
        </>
    )
}