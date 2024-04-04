import React from 'react';
import PriceHistoryChart from './PriceHistoryChart';
import AssetSummary from './AssetSummary';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

export default function AssetOverview({ symbol, assetData }) {
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Card sx={{ padding: "3%", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                                <CardContent>
                                    <PriceHistoryChart symbol={symbol} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card sx={{ marginTop: "2%", padding: "4%", paddingTop: "1%", paddingBottom: "0", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                                <CardContent>
                                    <h4 style={{ marginBottom: "2em" }}>About the asset</h4>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <p style={{ color: "#89949d" }}>Ticker:</p>
                                                <p style={{ color: "white", fontWeight: "bold" }}>{assetData.ticker}</p>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <p style={{ color: "#89949d" }}>Website:</p>
                                                <p style={{ color: "white", fontWeight: "bold" }}><a href={assetData.website} target="_blank" rel="noreferrer">{assetData.website}</a></p>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <p style={{ color: "#89949d" }}>Country:</p>
                                                <p style={{ color: "white", fontWeight: "bold" }}>{assetData.country}</p>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <p style={{ color: "#89949d" }}>Sector:</p>
                                                <p style={{ color: "white", fontWeight: "bold" }}>{assetData.sector}</p>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <p style={{ color: "white", marginTop: "1em" }}>{assetData.about}</p>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ padding: "3%", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                        <CardContent>
                            <AssetSummary symbol={symbol} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}