import styles from './Home.module.css';
import { FaCrown } from "react-icons/fa";
import {useSelector} from 'react-redux';


export default function Home({ gameOverRef, gameOverUpdate , score}){
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
        <div className={styles.homeContainer}>
            <FaCrown className={styles['home-crown']} />
            <span className={styles['highScore']}>{highScore}</span>
            <span className={styles['score']}>Score: {score.current}</span>
            <button className={styles['home-button']} 
            onClick={() => {
                gameOverUpdate(false);
                gameOverRef.current=false;
                score.current=0;
                updateGamesPlayedCount();
            }}
            >Play</button>
        </div>
    );
};
