import { useState, useEffect } from 'react';
import { BsFillStopwatchFill } from "react-icons/bs";
import styles from './Game.module.css';
export default function Timer({gameOverHandler}) {
    const [timer, updateTimer] = useState(30);

    useEffect(() => {
        if(timer<=0){
            gameOverHandler();
            return;
        }
        const interval = setInterval(() => {
            updateTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className={styles['timer-container']}>
            <div className={styles['timer']}>
                <BsFillStopwatchFill />
                <span>{timer}</span>
            </div>
        </div>
    );
}