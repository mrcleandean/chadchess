import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

function formatTime(ms: number) {
    let seconds = Math.floor(ms / 1000); // Convert milliseconds to seconds
    let minutes = Math.floor(seconds / 60); // Convert seconds to minutes
    seconds = seconds % 60; // Remaining seconds after extracting minutes

    // Format the minutes and seconds to always include two digits
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

const Timer = ({ active }: { active: boolean }) => {
    const [time, setTime] = useState<string>('5:00');
    const flagged = useRef(new Date().getTime() + 5 * 60 * 1000);
    useEffect(() => {
        if (!active) return;
        const intervalId = setInterval(() => {
            const newTime = flagged.current - new Date().getTime();
            if (newTime <= 0) socket.emit('flagged');
            setTime(formatTime(newTime));
        }, 500);
        return () => {
            clearInterval(intervalId);
            // flagged.current = flagged.current - 
        }
    }, [active]);
    return (
        <h1 className="text-3xl text-white">{time}</h1>
    )
}

export default Timer;