import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ButtonGroup, Button } from '@mui/material';
import { Box } from '@mui/material';
import { cheerfulFiestaPalette } from '@mui/x-charts/colorPalettes';

export default function PortfolioPieChart({ pid }) {
    const [assets, setAssets] = useState(null);
    const [selectedButton, setSelectedButton] = useState('Asset');

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    useEffect(() => {
        axios.get(`http://localhost:8000/portfolio/${pid}/assets/`)
            .then(response => {
                const assetsWithValues = response.data
                
                // Calculate the total value of all assets
                const totalValue = assetsWithValues.reduce((total, asset) => total + parseFloat(asset.currentValue), 0);

                // Calculate the percentage of each asset's value relative to the total
                const assetsWithPercentages = assetsWithValues.map(asset => ({
                    ...asset,
                    percentage: parseFloat((asset.currentValue / totalValue) * 100).toFixed(2)
                }));

                if (selectedButton === 'Type') {
                    const assetClasses = {};
                    assetsWithPercentages.forEach(asset => {
                        if (assetClasses[asset.type]) {
                            assetClasses[asset.type] += parseFloat(asset.percentage);
                        } else {
                            assetClasses[asset.type] = parseFloat(asset.percentage);
                        }
                    });
                    setAssets(Object.entries(assetClasses).map(([type, percentage], id) => ({
                        id,
                        percentage,
                        name: type
                    })));
                } else if (selectedButton === 'Sector') {
                    const sectors = {};
                    assetsWithPercentages.forEach(asset => {
                        if (sectors[asset.sector]) {
                            sectors[asset.sector] += parseFloat(asset.percentage);
                        } else {
                            sectors[asset.sector] = parseFloat(asset.percentage);
                        }
                    });
                    setAssets(Object.entries(sectors).map(([sector, percentage], id) => ({
                        id,
                        percentage,
                        name: sector
                    })));
                } else {
                    setAssets(assetsWithPercentages);
                }
            })
            .catch(error => {
                console.error('Unable to retrieve assets', error);
            });
    }, [pid, selectedButton]);

    // Convert the assets array into the format required by the PieChart component
    const pieChartData = assets?.map((asset, id) => ({
        id,
        value: parseFloat(asset.percentage), // Convert string to number
        label: asset.name
    }));

    if (!pieChartData) {
        return <div>Loading...</div>;
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingTop={'10px'}>
            <ButtonGroup variant="contained" color="primary" size='small'>
                <Button onClick={() => handleButtonClick('Asset')} sx={{ '&:focus': { outline: 'none' }, backgroundColor: '#2f77d3' }}>Asset</Button>
                <Button onClick={() => handleButtonClick('Type')} sx={{ '&:focus': { outline: 'none' }, backgroundColor: '#2f77d3' }}>Type</Button>
                <Button onClick={() => handleButtonClick('Sector')} sx={{ '&:focus': { outline: 'none' }, backgroundColor: '#2f77d3' }}>Sector</Button>
            </ButtonGroup>
            <PieChart
                margin={{ top: 30, bottom: 150, left: 100, right: 100 }}
                colors={cheerfulFiestaPalette}
                series={[{
                    data: pieChartData,
                    innerRadius: 70,
                    outerRadius: 120,
                    paddingAngle: 5,
                    cornerRadius: 4,
                    startAngle: -180,
                    endAngle: 180,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 10, additionalRadius: -30, color: 'gray' },
                }]}
                height={540}
                /*slotProps={{ legend: { hidden: true } }}*/
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        labelStyle: {
                            fontSize: 12,
                            fill: 'white',
                        },
                    },
                }}
                sx={{
                    '.MuiPieArc-root': {
                        stroke: 'none',
                    },
                }}
            />
        </Box>
    );
}