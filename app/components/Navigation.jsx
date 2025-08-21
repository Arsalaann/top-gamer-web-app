'use client';
import styles from "./Navigation.module.css";
import { useState} from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { MdVideogameAsset } from "react-icons/md";
import { IoHomeSharp } from "react-icons/io5";
import { FaLeftLong } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";

import { update } from '../redux/slices/currentNavigationIndexSlice';
import { update as navDirection } from '../redux/slices/slideDirectionSlice';
import { useSelector,useDispatch } from 'react-redux';




export default function Navigation({navLinks}) {

    const currentSelectionIndex=useSelector((state)=>state.currentNavigationIndex);
    const dispatch= useDispatch();
    const [isNav, isNavUpdate] = useState(true);


    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={isNav ? "navOn" : "navOff"} 
                    initial={{ opacity: 0, x: -250 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -250 }}
                    transition={{ duration: 0.2 }}
                    className={`${isNav && styles.navigationContainer}`}
                >
                    {isNav &&
                        <aside
                            className={styles.sidebarContainer}
                        >

                            <div className={styles.topGamerContainer}>
                                <h1>More Coming...</h1>
                                <FaLeftLong
                                    className={styles.navClose}
                                    onClick={() => isNavUpdate(false)}
                                />
                            </div>
                            <nav className={styles.navigation}>
                                {navLinks.map((navlink, ind) => (
                                    
                                    <li
                                        key={ind} 
                                        onClick={() => { dispatch(navDirection(0)); dispatch(update(ind)) }}
                                        className={ind === currentSelectionIndex ? styles.activeLink : ""}
                                    >
                                        <span>
                                            {navlink.name}{ind === 0 && <IoHomeSharp className={styles.navLinksLogo} />}


                                            {
                                                ind > 0 ? ind == currentSelectionIndex ?
                                                    <MdVideogameAsset className={styles.navLinksLogo} /> :
                                                    <MdKeyboardDoubleArrowRight className={styles.navLinksLogo} />
                                                    :
                                                    ''

                                            }
                                        </span>
                                    </li>
                                ))}
                            </nav>
                        </aside>
                    }
                </motion.div>
            </AnimatePresence>

            {!isNav &&
                <div className={styles.navOpenContainer} onClick={() => isNavUpdate(true)}>
                    <IoGameController
                        className={styles.navOpen}
                    />
                </div>
            }
        </>

    );
}