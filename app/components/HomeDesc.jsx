import styles from './HomeDesc.module.css';
import { BsFillPeopleFill } from "react-icons/bs";
import { GiJoystick } from "react-icons/gi";
import { motion } from 'framer-motion';
export default function HomeDesc() {
    return (
        <motion.div
            initial={{y:-400}}
            animate={{y:0}}
            transition={{duration:0.5,}}
            className={styles.homeStatsContainer}>
                <div className={styles.totalPlayersContainer}>
                    <div className={styles.totalPlayers}><BsFillPeopleFill/></div>
                    <div>:1234</div>
                </div>
                <div className={styles.gamesPlayCountContainer}>
                    <div className={styles.gamesPlayCount}><GiJoystick/></div>
                    <div>:456789</div>
                </div>
        </motion.div>
    );
}