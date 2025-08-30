import style from './Home.module.css';
import { FaCrown } from "react-icons/fa";
import { FaInfinity } from "react-icons/fa6";
import { useSelector } from 'react-redux';

export default function Home({ gameOverUpdate, totalClicks, score, totalClicksUpdate }) {
    const ind = useSelector((state) => state.currentNavigationIndex);

    const updateGamesPlayedCount = () => {
        try {
            fetch("/api/count?increment=true", { method: "GET" })
                .catch(err => console.error("Error updating games count:", err));
        } catch (err) {
            console.error("Error updating games count:", err);
        }
    };

    const findHighScore = (g) => {
        let x = 4;
        while (x > 0 && g[x][0] === 0) x--;
        return g[x][0];
    }
    const highScore = useSelector((state) => findHighScore(state.userData.userData.games[ind - 1]));
    return (
        <div className={style['home-container']}>
            <FaCrown className={style['home-crown']} />
            {highScore > 0 ?
                <span className={style['home-high-score']}>{highScore}s</span> :
                <FaInfinity className={style['home-high-score']} />
            }
            <span className={style['score']}>Score: {score}s</span>

            <span className={style['total-clicks']}>Total Clicks: {totalClicks}</span>
            <button className={style['home-button']} onClick={() => { gameOverUpdate(false); totalClicksUpdate(0);updateGamesPlayedCount() }}>Play</button>
        </div>
    );
};
