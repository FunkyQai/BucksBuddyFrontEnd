import React from "react";
import errorRocket from "../images/ErrorRocket.png";

export default function DisplayError() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
            <img src={errorRocket} alt="error-rocket" style={{ width: 'auto', height: '500px' }} />
            <h1>Information Unavailable</h1>
        </div>
    );
}