import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Grid } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SavingsIcon from '@mui/icons-material/Savings';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PortfolioPieChart from "./PortfolioPieChart";
import AssetTable from "./AssetTable";
import DividendsReceivedChart from "./DividendsReceivedChart";
import PortfolioValueChart from "./PortfolioValueChart";

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



export default function Common({ pid }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getPortfolioValue = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/portfolio/portfolio-value/${pid}/`);
                const data = response.data;
                setData(data);

            } catch (error) {
                console.error(error);
            }
        };

        getPortfolioValue();
    }, [pid]);
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Card sx={{ padding: "2%", backgroundColor: "#32323e", color: "white", borderRadius: "8px", height: "160px" }}>
                        <CardContent>
                            <p style={{ marginBottom: "5px" }}><AccountBalanceWalletIcon sx={{ color: '#3cb0f6' }} /> Portfolio Value</p>
                            <h3>{data ? data['portfolio value'] : null} USD</h3>
                            <p style={{ color: "#c4c4c4" }}>{data ? data['Amount invested'] : null} USD invested</p>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ padding: "2%", backgroundColor: "#32323e", color: "white", borderRadius: "8px", height: "160px" }}>
                        <CardContent>
                            <p style={{ marginBottom: "5px" }}><RequestQuoteIcon sx={{ color: '#7e6bfb' }} /> Total Profit &nbsp;                             
                            <HTMLTooltip title="Calculated by taking the portfolio value - Amount invested - fees + Dividends + Realised P/L" >
                                <HelpOutlineIcon sx={{ fontSize: 'medium' }} />
                            </HTMLTooltip></p>
                            <Tooltip
                                title={
                                    <>
                                        Realised P/L: {data ? data['Realised P/L'] : null} USD
                                        <p>Total Fees Paid: {data ? data['Total fees'] : null} USD</p>
                                    </>
                                }
                            >
                                <h3>{data ? data['Profit'] : null} USD</h3>
                            </Tooltip>
                            <p style={{ color: data && data['Profit percentage change'] > 0 ? '#6fd498' : '#e06b5b' }}>
                                {data ? data['Profit percentage change'] : null}%
                                {data && data['Profit percentage change'] > 0 ? <KeyboardArrowUpIcon sx={{ color: '#6fd498' }} /> : <KeyboardArrowDownIcon sx={{ color: '#e06b5b' }} />}
                            </p>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ padding: "2%", backgroundColor: "#32323e", color: "white", borderRadius: "8px", height: "160px" }}>
                        <CardContent>
                            <p style={{ marginBottom: "5px" }}><SavingsIcon sx={{ color: '#6fd498' }} /> Dividends</p>
                            <h3 style={{ marginBottom: "0" }}>{data ? data['Annual dividends'] : null} USD</h3>
                            <p style={{ marginBottom: "5px", color: "#c4c4c4" }}>annually</p>
                            <p style={{ color: "#c4c4c4" }}>{data ? data['Monthly dividends'] : null} USD monthly</p>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card sx={{ padding: "3%", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                        <PortfolioPieChart pid={pid} />
                    </Card>
                </Grid>
                <Grid item xs={8}>
                    <Card sx={{ padding: "3%", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                        <AssetTable pid={pid} />
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card sx={{ padding: "3%", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                        <DividendsReceivedChart pid={pid} />
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card sx={{ padding: "3%", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                        <PortfolioValueChart pid={pid} />
                    </Card>
                </Grid>
            </Grid>

        </>
    );
}