import { use } from 'react';
import style from './Home.module.css';
import { FaCrown } from "react-icons/fa";
import { useSelector } from 'react-redux';

export default function Home({ gameOverUpdate, score,scoreSet}){
    const ind = useSelector((state) => state.currentNavigationIndex);
    const highScore= useSelector((state) => state.userData.userData.games[ind-1][0][0]);
    const updateGamesPlayedCount = () => {
        try {
            fetch("/api/count?increment=true", { method: "GET" })
                .catch(err => console.error("Error updating games count:", err));
        } catch (err) {
            console.error("Error updating games count:", err);
        }
    };
    return (
        <div className={style['home-container']}>
            <FaCrown className={style['home-crown']} />
            <div className={style['home-high-score']}>{highScore}</div>
            <span className={style['score']}>Score: {score} </span>
            <div className={style['home-button']} onClick={() => {gameOverUpdate(false);scoreSet(0);updateGamesPlayedCount()}}>Play</div>
        </div>
    );
};
