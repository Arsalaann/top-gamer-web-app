'use client';
import Navigation from "./components/Navigation";
import CurrentSelection from "./components/CurrentSelection";
import RightAside from "./components/RightAside";
import styles from "./page.module.css";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setGames } from '@/app/redux/slices/gamesSlice';

export default function Home() {

  const games = useSelector((state) => state.games.games);
  const [isChecked, setIsChecked] = useState(false);
  const [error,setError]=useState('Loading...');
  const dispatch = useDispatch();



useEffect(() => {
  async function fetchGamesData() {
    try {
      const res = await fetch("/api/games");

      if (!res.ok) {
        setIsChecked(false);
        setError("Check Your Internet Connection");
        return;
      }

      const data = await res.json();

      const updatedGames = games.map((game, ind) => {
        const gameData = data.find((g) => g._id === ind);
        if (!gameData) return game;
        const { _id, ...rest } = gameData;
        return { ...game, ...rest };
      });

      dispatch(setGames(updatedGames));
      setIsChecked(true);
    } catch (err) {
      setIsChecked(false);
      setError("Check Your Internet Connection");
      console.error("Fetch failed:", err);
    }
  }

  fetchGamesData();

  const interval = setInterval(fetchGamesData, 10000);
  return () => clearInterval(interval);
}, []);







  return isChecked ? (
    <div className={styles.homeContainer}>
      <Navigation />
      <CurrentSelection />
      <RightAside />
    </div >
  ) : 
    <div className={styles.loading}>{error}</div>;
}
