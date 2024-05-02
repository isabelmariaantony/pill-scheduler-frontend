// Administration.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Administration.css'; // Importing the CSS stylesheet

function Administration() {
    const [serverInfo, setServerInfo] = useState({});
    const [serverInfoError, setServerInfoError] = useState('');
    const [pillTimes, setPillTimes] = useState([]);
    const [pillTimesError, setPillTimesError] = useState('');

    useEffect(() => {
        fetchServerInfo();
        fetchPillTimes();
    }, []);

    const fetchServerInfo = async () => {
        try {
            const response = await axios.get('https://pill-scheduler-backend.onrender.com/getServerInfo');
            setServerInfo(response.data);
            setServerInfoError(''); // Clear any previous server info errors
        } catch (error) {
            console.error('Error fetching server info:', error);
            setServerInfoError('Failed to fetch server information: ' + error.message);
        }
    };

    const fetchPillTimes = async () => {
        try {
            const response = await axios.get('https://pill-scheduler-backend.onrender.com/pillsByTimeRange');
            setPillTimes(response.data);
            setPillTimesError(''); // Clear any previous pills by time range errors
        } catch (error) {
            console.error('Error fetching pills by time range:', error);
            setPillTimesError(error.response.data.error || 'Failed to fetch pills by time range.');
        }
    };

    const markServed = async () => {
        try {
            await axios.get('https://pill-scheduler-backend.onrender.com/markServed');
            fetchPillTimes(); // Refresh the pill by time range data
        } catch (error) {
            console.error('Error marking time as served:', error);
            setPillTimesError('Failed to mark time range as served: ' + error.message);
        }
    };

    const unMarkServed = async () => {
        try {
            await axios.get('https://pill-scheduler-backend.onrender.com/unMarkServed');
            fetchPillTimes(); // Refresh the pill by time range data
        } catch (error) {
            console.error('Error unmarking time as served:', error);
            setPillTimesError('Failed to unmark time range as served: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h2>Server Information</h2>
            {serverInfoError ? <p className="error-message">{serverInfoError}</p> : <p>{JSON.stringify(serverInfo, null, 2)}</p>}
            <h2>Pills for current time range</h2>
            {pillTimesError ? <p className="error-message">{pillTimesError}</p> : (
                 <p>
                  {JSON.stringify(pillTimes)}
                 </p>
            )}
            <button onClick={markServed}>Mark Current Time as Served</button>
            <button onClick={unMarkServed}>Unmark Current Time as Served</button>
        </div>
    );
}

export default Administration;
