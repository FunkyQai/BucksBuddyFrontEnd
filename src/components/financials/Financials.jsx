import React, { useState } from "react";
import { Card, Tabs, Tab } from "@mui/material";
import CashFlow from "./CashFlow";
import IncomeStatement from "./IncomeStatement";
import BalanceSheet from "./BalanceSheet";

export default function Financials({ symbol }) {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Card sx={{ padding: "3%", backgroundColor: "#32323e", borderRadius: "8px" }}>
            <Tabs value={selectedTab} onChange={handleChange} sx={{
                marginBottom: "20px",
                "& .MuiTab-root": {
                    outline: "none",
                    color: "white",
                    borderRadius: "10px"
                },
                "& .Mui-selected": {
                    outline: "none",
                    backgroundColor: "white",
                    color: "#32323e !important",
                    borderRadius: "10px"
                },
                "& .MuiTabs-indicator": {
                    display: "none"
                }
            }}>
                <Tab label="Income Statement" />
                <Tab label="Balance Sheet" />
                <Tab label="Cash Flow" />
            </Tabs>
            {selectedTab === 0 && <IncomeStatement symbol={symbol} />}
            {selectedTab === 1 && <BalanceSheet symbol={symbol} />}
            {selectedTab === 2 && <CashFlow symbol={symbol} />}
        </Card>
    );
}