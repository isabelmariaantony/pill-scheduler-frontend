import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const timeRangesWithAliases = {
    '5AM-10AM': 'Morning (5AM-10AM)',
    '10AM-12PM': 'Noon (10AM-12PM)',
    '12PM-4PM': 'Afternoon (12PM-4PM)',
    '4PM-8PM': 'Evening (4PM-8PM)',
    '8PM-5AM': 'Night (8PM-5AM)'
};

function PillManager() {
    const [pills, setPills] = useState({});

    useEffect(() => {
        fetchPills();
    }, []);

    const fetchPills = async () => {
        const response = await axios.get('http://localhost:4000/pills');
        const updatedPills = response.data.reduce((acc, pill) => {
            acc[pill.boxNumber] = { ...pill, schedule: mapSchedule(pill.schedule) };
            return acc;
        }, {});
        setPills(updatedPills);
    };

    const mapSchedule = (scheduleArray) => {
        const scheduleMap = {};
        Object.keys(timeRangesWithAliases).forEach(range => {
            scheduleMap[range] = { checked: false, count: 1 }; // Default count initialized to 1
        });
        (scheduleArray || []).forEach(item => {
            if (scheduleMap[item.timeRange]) {
                scheduleMap[item.timeRange] = { checked: true, count: item.count };
            }
        });
        return scheduleMap;
    };

    const handleAddPill = async (event) => {
        event.preventDefault();
        const name = event.target.elements.name.value;
        const boxNumber = event.target.elements.boxNumber.value;
        try {
            await axios.post('http://localhost:4000/addPill', { name, boxNumber });
            fetchPills();
        } catch (error) {
            alert('Failed to add pill: ' + error.response.data.error);
        }
    };

    const handleDeletePill = async (boxNumber) => {
        try {
            await axios.delete(`http://localhost:4000/deletePill/${boxNumber}`);
            fetchPills();
        } catch (error) {
            alert('Failed to delete pill: ' + error.response.data.error);
        }
    };

    const updateSchedule = (boxNumber, timeRange, checked, count) => {
        const updatedPills = { ...pills };
        if (!updatedPills[boxNumber].schedule[timeRange]) {
            updatedPills[boxNumber].schedule[timeRange] = { checked: false, count: 1 };
        }
        updatedPills[boxNumber].schedule[timeRange].checked = checked;
        updatedPills[boxNumber].schedule[timeRange].count = count ? parseInt(count, 10) : 1;
        setPills(updatedPills);
    };

    const saveSchedule = async (boxNumber) => {
        const scheduleToSend = Object.entries(pills[boxNumber].schedule)
            .filter(([_, details]) => details.checked)
            .map(([timeRange, details]) => ({
                timeRange,
                count: details.count
            }));

        try {
            await axios.post('http://localhost:4000/updateSchedule', { boxNumber, schedule: scheduleToSend });
            alert('Schedule saved successfully!');
        } catch (error) {
            alert('Failed to save schedule: ' + error.response.data.error);
        }
    };

    return (
        <div>
            <form onSubmit={handleAddPill}>
                <input type="text" name="name" required placeholder="Pill Name" />
                <select name="boxNumber" required>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map(box => 
                        (!pills[box] ? <option key={box} value={box}>{box}</option> : null)
                    )}
                </select>
                <button type="submit">Add Pill</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Pill Name</th>
                        <th>Box Number</th>
                        <th>Schedule</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(pills).map(boxNumber => (
                        <tr key={boxNumber}>
                            <td>{pills[boxNumber].name || "empty"}</td>
                            <td>{boxNumber}</td>
                            <td>
                                {Object.entries(pills[boxNumber].schedule).map(([timeRange, { checked, count }]) => (
                                    <div key={timeRange}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={e => updateSchedule(boxNumber, timeRange, e.target.checked, count)}
                                            />
                                            {timeRangesWithAliases[timeRange]}
                                            {checked && (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={count}
                                                    onChange={e => updateSchedule(boxNumber, timeRange, true, e.target.value)}
                                                    style={{ marginLeft: '10px' }}
                                                />
                                            )}
                                        </label>
                                    </div>
                                ))}
                                <button onClick={() => saveSchedule(boxNumber)}>Save</button>
                            </td>
                            <td>
                                <button onClick={() => handleDeletePill(boxNumber)} style={{ border: 'none', background: 'none' }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PillManager;
