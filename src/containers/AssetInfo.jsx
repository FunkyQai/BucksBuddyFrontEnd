import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from '@mui/material';
import Stack from '@mui/material/Stack';
import Item from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CircularProgress from '@mui/material/CircularProgress';
import AssetOverview from '../components/assets/AssetOverview';
import Dividends from '../components/dividend/Dividends';
import NewsPage from '../components/assets/NewsPage';
import Financials from '../components/financials/Financials';


function AssetInfo() {
    const { symbol } = useParams();
    const [assetData, setAssetData] = useState(null);
    const [logo, setLogo] = useState(null);

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    useEffect(() => {
        const searchAsset = async () => {
            try {
                setAssetData(null)
                setLogo(null)
                const info = await axios.get('http://localhost:8000/public/asset/', { params: { symbol } });
                setAssetData(info.data);
                const logoResponse = await axios.get('http://localhost:8000/public/asset/logo/', { params: { symbol } });
                setLogo(logoResponse.data[0].image);

            } catch (error) {
                console.error(error);
            }
        };

        searchAsset();
    }, [symbol]);

    return (
        <Container  sx={{ minHeight: '100%'}}>
            {assetData ? (
                <>
                    <Card sx={{ marginTop: "2%", padding: "3%", paddingBottom: "0", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                        <Stack spacing={2}>
                            <Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2>{assetData.company_name}</h2>
                                    <h4 style={{ color: "#89949d" }}>({assetData.ticker})</h4>
                                </div>
                                <img src={logo} alt="" style={{ width: 'auto', height: '50px' }} />
                            </Item>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <h1>$ {assetData.price}</h1>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={3} style={{ color: "#89949d" }}>P/E</Grid>
                                        <Grid item xs={3} style={{ color: "#89949d" }}>EPS</Grid>
                                        <Grid item xs={3} style={{ color: "#89949d" }}>Market Cap</Grid>
                                        <Grid item xs={3} style={{ color: "#89949d" }}>Dividend Yield</Grid>
                                        <Grid item xs={3}>{parseFloat(assetData.trailingPE).toFixed(2)}</Grid>
                                        <Grid item xs={3}>{parseFloat(assetData.trailingEps).toFixed(2)}</Grid>
                                        <Grid item xs={3}>{parseFloat(assetData.marketCap / 1000000000).toFixed(2)}B</Grid>
                                        <Grid item xs={3}>{parseFloat(assetData.dividendYield * 100).toFixed(2)}%</Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <TabContext value={value}>
                                <Box>
                                    <TabList onChange={handleChange} aria-label="tab" sx={{ '& .MuiTabs-indicator': { height: '5px' } }} >
                                        <Tab label="Overview" value="1" sx={{ '&.Mui-selected': { outline: 'none' }, paddingBottom: '25px', color: "#89949d" }} />
                                        <Tab label="Dividends" value="2" sx={{ '&.Mui-selected': { outline: 'none' }, paddingBottom: '25px', color: "#89949d" }} />
                                        <Tab label="Financials" value="3" sx={{ '&.Mui-selected': { outline: 'none' }, paddingBottom: '25px', color: "#89949d" }} />
                                        <Tab label="News" value="4" sx={{ '&.Mui-selected': { outline: 'none' }, paddingBottom: '25px', color: "#89949d" }} />
                                    </TabList>
                                </Box>
                            </TabContext>
                        </Stack>
                    </Card>

                    <TabContext value={value}>
                        <TabPanel value="1" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <AssetOverview symbol={symbol} assetData={assetData} />
                        </TabPanel>
                        <TabPanel value="2" style={{ paddingLeft: 0, paddingRight: 0 }}><Dividends symbol={symbol}></Dividends></TabPanel>
                        <TabPanel value="3" style={{ paddingLeft: 0, paddingRight: 0 }}><Financials symbol={symbol}></Financials></TabPanel>
                        <TabPanel value="4" style={{ paddingLeft: 0, paddingRight: 0 }}><NewsPage symbol={symbol}></NewsPage></TabPanel>
                    </TabContext>
                </>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            )}
        </Container>
    );
}

export default AssetInfo;