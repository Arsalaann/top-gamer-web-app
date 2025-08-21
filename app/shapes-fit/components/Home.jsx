import style from './Home.module.css';
import { FaCrown } from "react-icons/fa";

export default function Home({ gameOverUpdate, highScore, score,scoreUpdate}){
    return (
        <div className={style['home-container']}>
            <FaCrown className={style['home-crown']} />
            <span className={style['home-high-score']}>{highScore}</span>
            <span className={style['score']}>Score: {score} </span>
            <div className={style['home-button']} onClick={() => {gameOverUpdate(false);scoreUpdate(0)}}>Play</div>
        </div>
    );
};
