import styles from './Home.module.css';
import { FaCrown } from "react-icons/fa";


export default function Home({ gameOverRef, gameOverUpdate , highScore, score}){
    return (
        <div className={styles.homeContainer}>
            <FaCrown className={styles['home-crown']} />
            <span className={styles['highScore']}>{highScore}</span>
            <span className={styles['score']}>Score: {score.current}</span>
            <button className={styles['home-button']} 
            onClick={() => {
                gameOverUpdate(false);
                gameOverRef.current=false;
                score.current=0;
            }}
            >Play</button>
        </div>
    );
};
