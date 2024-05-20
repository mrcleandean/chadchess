import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { socket } from "../socket";

import type { OutcomeType } from "./Online";

function formatTime(ms: number) {
    let seconds = Math.floor(ms / 1000); // Convert milliseconds to seconds
    let minutes = Math.floor(seconds / 60); // Convert seconds to minutes
    seconds = seconds % 60; // Remaining seconds after extracting minutes

    // Format the minutes and seconds to always include two digits
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

const Timer = ({ active, me, setOutcome }: { active: boolean, me: boolean, setOutcome: Dispatch<SetStateAction<OutcomeType>> }) => {
    const [time, setTime] = useState<string>('5:00');
    const timeLeft = useRef(5 * 60 * 1000);
    useEffect(() => {
        if (!active) return;
        let timeStarted = new Date().getTime();
        let newTime = timeLeft.current;
        const intervalId = setInterval(() => {
            const elapsed = new Date().getTime() - timeStarted;
            newTime = timeLeft.current - elapsed;
            setTime(formatTime(newTime));
            if (newTime <= 0) {
                socket.emit('flagged');
                setTime('0:00');
                setOutcome({
                    by: 'flag',
                    winner: me ? 'opponent' : 'user'
                });
                clearInterval(intervalId);
            };
        }, 900);
        return () => {
            timeLeft.current = newTime;
            clearInterval(intervalId);
        }
    }, [active]);
    return (
        <h1 className="text-3xl text-white">{time}</h1>
    )
}

export default Timer;