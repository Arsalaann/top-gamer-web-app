import { FaCrown } from "react-icons/fa";
import style from './TopBar.module.css';
import { RxExit } from "react-icons/rx";

const TopBar = ({ highScore,gameOverHandler }) => {

    return (
        <div className={style['top-bar-container']}>
            {highScore > 0 &&
                <div className={style['high-score-container']}>
                    <FaCrown className={style['high-score-crown']} />
                    <span className={style['high-score']}>{highScore}s</span>
                </div>
            }
            <div className={style['exit']}>
                <RxExit  onClick={gameOverHandler} />
            </div>

        </div>

    );
};

export default TopBar;