import React, { useEffect, useRef } from 'react';

const startTime = new Date('2024-07-09T16:50:00');
const endTime = new Date('2024-07-09T17:00:00');

const Clock = ({ resetSignal, openFailureModal }) => {
    const currentTime = useRef(startTime);
    const timerID = useRef(null);
    const displayTime = useRef(null);

    const updateTime = () => {
        const now = new Date(currentTime.current.getTime() + 1000);
        currentTime.current = now;
        displayTime.current.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).replace(/ ?[AP]M$/, '');

        if (now >= endTime) {
            clearInterval(timerID.current);
            openFailureModal();
        }
    };

    useEffect(() => {
        timerID.current = setInterval(updateTime, 1000);
        return () => clearInterval(timerID.current);
    }, []);

    useEffect(() => {
        currentTime.current = startTime;
        if (displayTime.current) {
            displayTime.current.textContent = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).replace(/ ?[AP]M$/, '');
        }
    }, [resetSignal]);

    return <h1 id="Clock" ref={displayTime}></h1>;
};

export default Clock;
