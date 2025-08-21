import style from './Home.module.css';
import { FaCrown } from "react-icons/fa";

export default function Home({ gameOverUpdate, highScore, score,scoreSet}){
    return (
        <div className={style['home-container']}>
            <FaCrown className={style['home-crown']} />
            <div className={style['home-high-score']}>{highScore}</div>
            <span className={style['score']}>Score: {score} </span>
            <div className={style['home-button']} onClick={() => {gameOverUpdate(false);scoreSet(0)}}>Play</div>
        </div>
    );
};
