'use client'
import Stats from "./Stats";
import styles from './RightAside.module.css';
import { motion } from "framer-motion";
import { BsGlobeAmericas } from "react-icons/bs";
import { IoMdPerson } from "react-icons/io";
import { MdOutlineSportsScore } from "react-icons/md";
import { useSelector } from 'react-redux';
export default function RightAside({ navLinks }) {
    const ind = useSelector((state) => state.currentNavigationIndex);
    if (ind === 0) return;
    return (
        <div className={styles.rightAsideContainer}>
            <motion.div
                key={navLinks[ind].name}
                initial={{ opacity: 0, x: 600 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.gameDesc}>
                    {navLinks[ind].desc}
            </motion.div>
            <motion.div
                key={ind}
                initial={{ opacity: 0, x: 600 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={styles.aboutGameContainer}>

                <div className={styles.topGamerTitle}>{navLinks[ind].name} - Top Gamer</div>
                <div className={styles.topPlayerContainer}>

                    <div className={styles.topScore}><MdOutlineSportsScore />
                        <motion.div
                            key={ind}
                            animate={{ x: [5, -5, 4, -4, 3, -3, 2, -2, 1, -1, 0] }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className={styles.topScoreOnly}>{navLinks[ind].highScore.score}
                        </motion.div>
                    </div>
                    <div className={styles.containerCountryName}>
                        <div className={styles.playerName}><IoMdPerson /> {navLinks[ind].highScore.playerName}</div>
                        <div className={styles.country}><BsGlobeAmericas /> {navLinks[ind].highScore.country}</div>
                    </div>
                </div>

            </motion.div>
            <Stats currentGame={navLinks[ind]} />
        </div>

    );
}