import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Breadcrumbs, Link, Card, Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import BarChartIcon from '@mui/icons-material/BarChart';
import TransactionsIcon from '@mui/icons-material/AccountBalance';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';

import Transactions from "../components/portfolio/Transactions";
import PortfolioNews from "../components/portfolio/PortfolioNews";
import RiskMetrics from "../components/portfolio/RiskMetrics";
import Common from "../components/portfolio/Common";
import Chatbot from "../components/chatbot/Chatbot";



export default function Dashboard() {

    const [value, setValue] = useState('1');
    const [portfolioName, setPortfolioName] = useState('');
    const [isChatOpen, setChatOpen] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const minimiseChat = () => {
        setChatOpen(false);
    };

    const { pid } = useParams(); // Get the pid param from the URL

    useEffect(() => {
        axios.get('http://localhost:8000/portfolio/get-all/')
            .then(response => {
                const portfolio = response.data.find(portfolio => portfolio.id === Number(pid));
                if (portfolio) {
                    setPortfolioName(portfolio.name);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [pid]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ margin: isChatOpen ? "25px 2vw" : "25px 10vw", flex: 1 }}>

                <Breadcrumbs aria-label="breadcrumb" style={{ color: "#89949d" }}>
                    <Link underline="none" href="/home" style={{ color: "#89949d", textDecoration: 'none' }}>
                        <h6><span><BusinessCenterIcon sx={{ color: '#80461B' }} /></span> Portfolios</h6>
                    </Link>
                    <Link underline="none" href={`/dashboard/${pid}`} style={{ color: "white", textDecoration: 'none', '&:hover': { textDecoration: 'none' } }}>
                        <h3>{portfolioName}</h3>
                    </Link>
                </Breadcrumbs>
                
                <Card sx={{ marginTop: "1%", padding: "3%", paddingBottom: "0", paddingTop: "1%", backgroundColor: "#32323e", color: "white", borderRadius: "8px" }}>
                    <TabContext value={value}>
                        <Box>
                            <TabList centered onChange={handleChange} aria-label="tab" sx={{ '& .MuiTabs-indicator': { height: '5px' } }}>
                                <Tab icon={<BarChartIcon sx={{color:"white"}}/>} label="Common" value="1" sx={{ '&.Mui-selected': { outline: 'none' }, paddingBottom: '25px', color: "white" }} />
                                <Tab icon={<TransactionsIcon sx={{color:"white"}}/>} label="Transactions" value="2" sx={{ '&.Mui-selected': { outline: 'none' }, paddingBottom: '25px', color: "white" }} />
                                <Tab icon={<TroubleshootIcon sx={{color:"white"}}/>} label="Metrics" value="3" sx={{ '&.Mui-selected': { outline: 'none' }, paddingBottom: '25px', color: "white" }} />
                                <Tab icon={<NewspaperIcon sx={{color:"white"}}/>} label="News" value="4" sx={{ '&.Mui-selected': { outline: 'none' }, paddingBottom: '25px', color: "white" }} />
                            </TabList>
                        </Box>
                    </TabContext>
                </Card>

                <TabContext value={value}>
                    <TabPanel value="1" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Common pid={pid} />
                    </TabPanel>
                    <TabPanel value="2" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Transactions pid={pid} />
                    </TabPanel>
                    <TabPanel value="3" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <RiskMetrics pid = {pid}/>
                    </TabPanel>
                    <TabPanel value="4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <PortfolioNews pid={pid} />
                    </TabPanel>
                </TabContext>

                {!isChatOpen && (
                    <Fab
                        aria-label="chat"
                        size="large"
                        style={{
                            position: 'fixed',
                            bottom: '30px',
                            right: '40px',
                            backgroundColor: '#30798f',
                            
                        }}
                        onClick={() => setChatOpen(true)}
                    >
                        <ChatIcon sx={{color:"white"}}/>
                    </Fab>
                )}
            </div>

            {isChatOpen && (
                <div style={{
                    position: 'sticky',
                    top: '10vh',
                    flex: '0 0 30%',
                    height: '90vh',
                    overflow: 'auto',
                }}>
                    <Chatbot onBackClick={minimiseChat} pid={pid} />
                </div>
            )}
        </div>
    );
}