'use client';
import {  useState,useEffect, use } from "react";
import { IoMdLogOut } from "react-icons/io";
import { BsPersonVcard } from "react-icons/bs";
import styles from "./Stats.module.css";
import { motion } from "framer-motion";
import Form from './Form';
import { useSelector,useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userDataSlice";
export default function Stats() {
    const ind = useSelector((state) => state.currentNavigationIndex);
    const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
    const userData = useSelector((state) => state.userData.userData);
    const [showForm, showFormUpdate] = useState(0);
    const [isChecked, setIsChecked] = useState(false);

    const dispatch = useDispatch();
    const token = localStorage.getItem('jwtToken');

    const getCorrectHighScore=()=>{
        let x=4;
        while(x>0 && userData.games[ind-1][x][0]===0)
            x--;
        return userData.games[ind-1][x][0]+'s';
    }

    useEffect(() => {
        if(!token && isLoggedIn)
            dispatch(setUserData(null));
        if(token && !isLoggedIn){
            async function getUserData() {
                fetch('/api/user-data', {
                    method: 'GET',
                    headers: {  'authorization': `Bearer ${token}` }
                }).then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        console.log('Failed to fetch user data');
                    }       
                }).then(data => {
                    dispatch(setUserData(data));
                    setIsChecked(true);
                }).catch(err => {
                    console.error(err);     
                    setIsChecked(true);
                });
            }
            getUserData();
        }else
            setIsChecked(true);
    }, [token]);
    
    if(ind===0)
        return;
    if(!isChecked)
        return <div className={styles.statsContainer}>Loading...</div>  
    return isLoggedIn ? (
        <motion.div
            key={ind}
            initial={{ opacity: 0, x: 600 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={styles.statsContainer}>
            <div className={styles.username}><BsPersonVcard/><strong>{userData.username}</strong></div>
            <IoMdLogOut className={styles.logOut} onClick={()=>{localStorage.removeItem('jwtToken');dispatch(setUserData(null))}}/>
            <div className={styles.yourTopScoreTitle}>Your Top Score</div>
            <div className={styles.yourTopScore}>{ind===4?getCorrectHighScore():userData.games[ind-1][0][0]}</div>
            <div className={styles.yourTopTitle}>Your Top 5</div>
            {userData.games[ind-1].map((entry, index) =>
                <div key={index} className={styles.historyContainer}>
                    <span className={styles.entryDate}>
                        {entry[1]}
                    </span>
                    <span className={styles.entryTime}>
                        {entry[2]}
                    </span>
                    <span className={styles.entryScore}>
                        {entry[0]}{ind===4?'s':""}
                    </span>
                </div>
            )}
        </motion.div>
    ) :
        <div className={styles.statsContainer}>
            {showForm === 0 ?
                <div className={styles.loginSignupContainer}>
                    <div className={styles.text1}>Welcome Gamer!</div>
                    <div onClick={()=>showFormUpdate(1)} className={styles.loginButton}>Login</div>
                    <div className={styles.text2}>or</div>
                    <div onClick={()=>showFormUpdate(2)} className={styles.signUpButton}>Signup</div>
                    <div className={styles.text3}>to save your scores and compete with others.</div>
                </div>
                : 
                <Form 
                    showForm={showForm} 
                    showFormUpdate={showFormUpdate}
                />
            }
            
        </div>
}