import styles from "./Stats.module.css";
import { motion } from "framer-motion";
export default function Stats({ currentGame }) {
    return (
        <motion.div
            key={currentGame.name}
            initial={{ opacity: 0, x: 600 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={styles.statsContainer}>
            <div className={styles.yourTopScoreTitle}>You'r Top Score</div>
            <div className={styles.yourTopScore}>{currentGame.yourHistory[0][2]}</div>
            <div className={styles.yourTopTitle}>Your Top 5</div>
            {currentGame.yourHistory.map((entry, ind) =>
                <div key={ind} className={styles.historyContainer}>
                    <span className={styles.entryDate}>
                        {entry[0]}
                    </span>
                    <span className={styles.entryTime}>
                        {entry[1]}
                    </span>
                    <span className={styles.entryScore}>
                        {entry[2]}
                    </span>
                </div>
            )}
        </motion.div>
    );
}