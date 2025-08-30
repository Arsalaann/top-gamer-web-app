import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import { BsFillStopwatchFill } from "react-icons/bs";
import TopBar from './TopBar';
import style from '../page.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserData } from '@/app/redux/slices/userDataSlice';
import { setGames } from '@/app/redux/slices/gamesSlice';


export default function Game({ gameOverUpdate, totalClicksUpdate, scoreUpdate }) {
    const ind = useSelector((state) => state.currentNavigationIndex);
    const userData = useSelector((state) => state.userData.userData);
    const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
    const highScore = useSelector((state) => state.games.games[ind].highScore);
    const games = useSelector((state) => state.games.games);

    const dispatch = useDispatch();

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

    const updateUserDataOnServer = async (games) => {
        try {
            //write code to call user-data api post method with token in header
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('/api/user-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ games })
            });

            if (!response.ok) {
                console.error('Failed to update user data on server');
            }
        } catch (error) {
            console.error('Error updating user data on server:', error);
        }
    }

    const updateHighScoreOnServer = async () => {
        try {
            const response = await fetch('/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({
                    gameId: ind,
                    highScore: timer,
                    playerName: userData.username,
                    playerCountry: userData.country
                })
            });
            if (!response.ok) {
                console.error('Failed to update high score on server');
            }
        } catch (error) {
            console.error('Error updating high score on server:', error);
        }
    };

    const gameOverHandler = () => {
        gameOverUpdate(true);
        if (counter <= 0) {
            if (isLoggedIn) {
                if (timer < highScore || highScore === 0) {
                    const updatedGames = games.map((game) => {
                        if (game._id === ind) {
                            return { ...game, highScore: timer, playerName: userData.username, playerCountry: userData.country };
                        }
                        return game;
                    });
                    dispatch(setGames(updatedGames));
                    updateHighScoreOnServer();
                }
            }
            if (timer < userData.games[ind - 1][0][0] || userData.games[ind - 1][0][0] === 0) {

                const updatedGames = userData.games.map(row => row.map(item => [...item]));

                let x = 0;
                while (x < 5 && timer < updatedGames[ind - 1][x][0])
                    x++;

                for (let i = 4; i > x; i--)
                    updatedGames[ind - 1][i] = updatedGames[ind - 1][i - 1];

                updatedGames[ind - 1][x] = [timer, new Date().toLocaleDateString(), new Date().toLocaleTimeString()];
                if (isLoggedIn)
                    updateUserDataOnServer(updatedGames);
                const newUserData = { ...userData, games: updatedGames };
                dispatch(updateUserData(newUserData));
            }
        }
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
