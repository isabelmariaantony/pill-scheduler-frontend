import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            const response = await axios.get('http://localhost:4000/getServerInfo');
            setServerInfo(response.data);
            setServerInfoError(''); // Clear any previous server info errors
        } catch (error) {
            console.error('Error fetching server info:', error);
            setServerInfoError('Failed to fetch server information: ' + error.message);
        }
    };

    const fetchPillTimes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/pillsByTimeRange');
            setPillTimes(response.data);
            setPillTimesError(''); // Clear any previous pills by time range errors
        } catch (error) {
            console.error('Error fetching pills by time range:', error);
            setPillTimesError( error.response.data.error);
        }
    };

    const markServed = async () => {
        try {
            await axios.get('http://localhost:4000/markServed');
            fetchPillTimes(); // Refresh the pill by time range data
        } catch (error) {
            console.error('Error marking time as served:', error);
            setPillTimesError('Failed to mark time range as served: ' + error.message);
        }
    };

    const unMarkServed = async () => {
        try {
            await axios.get('http://localhost:4000/unMarkServed');
            fetchPillTimes(); // Refresh the pill by time range data
        } catch (error) {
            console.error('Error unmarking time as served:', error);
            setPillTimesError('Failed to unmark time range as served: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Server Information</h2>
            {serverInfoError ? <p>Error: {serverInfoError}</p> : <p>{JSON.stringify(serverInfo)}</p>}
            <h2>Pills by Time Range (No Parameters)</h2>
            {pillTimesError ? <p> {pillTimesError}</p> : (
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
