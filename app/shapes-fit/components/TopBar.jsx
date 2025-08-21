import style from './TopBar.module.css';
import { RxExit } from "react-icons/rx";

const TopBar = ({ score,gameOverHandler }) => {

    return (
        <div className={style['top-bar-container']}>
            <div className={style['score']}>{score}</div>
            <div className={style['exit']}>
                <RxExit onClick={gameOverHandler} />
            </div>

        </div>

    );
};

export default TopBar;