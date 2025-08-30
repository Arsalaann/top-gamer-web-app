import styles from './HomeDesc.module.css';
import { BsFillPeopleFill } from "react-icons/bs";
import { GiJoystick } from "react-icons/gi";
import { motion } from 'framer-motion';

import { useEffect,useState} from 'react';

export default function HomeDesc() {
    const [usersCount,setUsersCount]=useState(1234);
    const [gamesPlayedCount,setGamesPlayedCount]=useState(123456);
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await fetch("/api/count");
                const counts = await res.json();
                setUsersCount(counts.usersCount);
                setGamesPlayedCount(counts.gamesPlayedCount);
            } catch (err) {
                console.error("Failed to fetch counts", err);
            }
        };
        fetchCounts();
    }, []);
    return (
        <motion.div
            initial={{ y: -400 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, }}
            className={styles.homeStatsContainer}>
            <div className={styles.totalPlayersContainer}>
                <div className={styles.totalPlayers}><BsFillPeopleFill /></div>
                <div>:{usersCount}</div>
            </div>
            <div className={styles.gamesPlayCountContainer}>
                <div className={styles.gamesPlayCount}><GiJoystick /></div>
                <div>:{gamesPlayedCount}</div>
            </div>
        </motion.div>
    );
}