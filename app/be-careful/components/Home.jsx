import style from './Home.module.css';
import { FaCrown } from "react-icons/fa";
import { FaInfinity } from "react-icons/fa6";

export default function Home({ gameOverUpdate, highScore, totalClicks, score,totalClicksUpdate}){
    return (
        <div className={style['home-container']}>
            <FaCrown className={style['home-crown']} />
            {highScore>0 ? 
                <span className={style['home-high-score']}>{highScore}s</span>:
                <FaInfinity className={style['home-high-score']}/>
            }
            <span className={style['score']}>Score: {score}s</span>
            
            <span className={style['total-clicks']}>Total Clicks: {totalClicks}</span>
            <button className={style['home-button']} onClick={() => {gameOverUpdate(false);totalClicksUpdate(0)}}>Play</button>
        </div>
    );
};
