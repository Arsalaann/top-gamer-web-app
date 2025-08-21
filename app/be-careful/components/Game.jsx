import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import { BsFillStopwatchFill } from "react-icons/bs";
import TopBar from './TopBar';
import style from '../page.module.css';

export default function Game({ gameOverUpdate, totalClicksUpdate, highScoreUpdate, scoreUpdate, highScore }) {
    const [counter, updateCounter] = useState(10);
    const [isPlusFirst, updateIsPlusFirst] = useState(1);
    const [timer, updateTimer] = useState(0);

    const isLeftKey = useRef(false);
    const isRightKey = useRef(false);
    const isPlusFirstRef = useRef(isPlusFirst);

    useEffect(() => {
        const interval = setInterval(() => {
            updateTimer(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (counter <= 0)
            gameOverHandler();
    }, [counter]);

    useEffect(() => {
        isPlusFirstRef.current = isPlusFirst;
    }, [isPlusFirst]);

    useEffect(() => {

        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
        }
    }, []);

    const keyDownHandler = (e) => {
        if (counter <= 0) return;

        if (e.key === 'ArrowLeft' || e.key === 'a') {
            if (!isLeftKey.current) {
                buttonClickHandler(isPlusFirstRef.current === 1 ? 1 : -1);
                isLeftKey.current = true;
            }
        }
        if (e.key === 'ArrowRight' || e.key === 'd') {
            if (!isRightKey.current) {
                buttonClickHandler(isPlusFirstRef.current === 1 ? -1 : 1)
                isRightKey.current = true;
            }
        }
    }
    const keyUpHandler = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a')
            isLeftKey.current = false;
        if (e.key === 'ArrowRight' || e.key === 'd')
            isRightKey.current = false;
    };

    const gameOverHandler = () => {
        gameOverUpdate(true);
        if (counter <= 0)
            highScoreUpdate((prev) => prev === 0 ? timer : Math.min(prev, timer));
        scoreUpdate(timer);
    }

    const buttonClickHandler = (arg) => {
        if (counter > 0) {
            updateCounter((prev) => prev + arg);
            totalClicksUpdate((prev) => prev + 1);
            updateIsPlusFirst(Math.floor(Math.random() * 2));
        }
    }

    const getTime = () => {
        let h = 0, m = 0, s = timer, result = "";
        if (s >= 3600) {
            h = Math.floor(s / 3600);
            s = s % 3600;
            if (h < 10)
                result += "0";
            result += h + ":";
        }
        if (s >= 60) {
            m = Math.floor(s / 60);
            s = s % 60;
        }

        if (m < 10)
            result += "0";
        result += m + ":";

        if (s < 10)
            result += "0";
        result += s;

        return result;
    }
    return (


        <div className={style['game-container']}>

            <TopBar highScore={highScore} gameOverHandler={gameOverHandler} />
            <div className={`${style['count-area']} ${counter > 10 && style['danger']}`}>
                {counter}
            </div>


            <div className={style['timer-container']}>
                <div className={style['timer']}>
                    <BsFillStopwatchFill />
                    <span>{getTime()}</span>
                </div>
            </div>

            <div className={style.controlButtonContainer}>
                <button
                    className={`${style.controlButton} ${isLeftKey.current && style.buttonActive}`}
                    onClick={() => buttonClickHandler(isPlusFirst ? 1 : -1)}>
                    {isPlusFirst === 1 ? <><FaPlus /> <FaPlus /></> : <><FaMinus /> <FaMinus /></>}
                </button>
                <button
                    className={`${style.controlButton} ${isRightKey.current && style.buttonActive}`}
                    onClick={() => buttonClickHandler(isPlusFirst ? -1 : 1)}>
                    {isPlusFirst === 1 ? <><FaMinus /> <FaMinus /></> : <><FaPlus /> <FaPlus /></>}
                </button>
            </div>
        </div>

    );
};
