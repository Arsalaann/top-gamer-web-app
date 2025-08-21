'use client';
import Image from "next/image";
import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import styles from "./CurrentSelection.module.css";
import { motion, AnimatePresence } from "framer-motion";
import HomeDesc from "./HomeDesc";

import { useSelector, useDispatch } from "react-redux";
import { update } from "../redux/slices/currentNavigationIndexSlice";
import { update as navDirection } from '../redux/slices/slideDirectionSlice';


const MotionImage = motion.create(Image);

export default function CurrentSelection({ navLinks }) {

    const ind = useSelector((state) => state.currentNavigationIndex);
    const navCurr = useSelector((state) => state.slideDirection);
    const dispatch = useDispatch();
    const slug = "/" + navLinks[ind].name.toLowerCase().replace(/\s+/g, '-');

    const handlePlayClick = (e) => {
        dispatch(navDirection(0));
        sessionStorage.setItem('canPlay','true');
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen().catch((err) => {
                console.warn("Fullscreen request failed:", err);
            });
        }
    };

    return (
        <div className={`${styles.currentSelectionContainer}`}>
            <AnimatePresence >
                <MotionImage
                    key={slug}
                    src={slug + ".png"}
                    alt={slug + " image"}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    initial={navCurr === 0 ? { opacity: 0 } : { opacity: 0.3, x: navCurr * 1000 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0.9 }}
                    transition={{ duration: 0.3 }}
                />
            </AnimatePresence>
            <motion.div
                key={ind}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className={styles.backgroundOverlay}>
            </motion.div>
            {ind === 0 && <HomeDesc />}
            <div className={styles.navGamesContainer}>
                <MdArrowBackIosNew
                    className={`${styles.arrowButtons} ${styles.arrowLeft}`}
                    onClick={() => { dispatch(navDirection(-1)); dispatch(update(ind === 0 ? navLinks.length - 1 : ind - 1)); }}
                />
                {ind > 0 ?
                    <Link href={slug} className={styles.playButtonContainer}>
                        <div onClick={handlePlayClick} className={styles.playButton}>
                            Activate
                        </div>
                    </Link> : <div></div>
                }
                <MdArrowForwardIos
                    className={`${styles.arrowButtons} ${styles.arrowRight}`}
                    onClick={() => { dispatch(navDirection(1)); dispatch(update(ind === navLinks.length - 1 ? 0 : ind + 1)); }}
                />
            </div>
        </div>

    )
}