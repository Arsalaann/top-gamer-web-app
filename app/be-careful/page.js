'use client';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Game from './components/Game';
import Home from './components/Home';

export default function BeCareful() {
    const [allowed,setAllowed]=useState(false);
    const router=useRouter();
    useEffect(() => {

        const canPlay = sessionStorage.getItem('canPlay');
        if (!canPlay)
            router.replace('/not-found');
        else
            setAllowed(true);

        const fullscreenHandler = () => {
            const isFullscreen = !!document.fullscreenElement;
            if (!isFullscreen)
                router.back();
        };
        document.addEventListener('fullscreenchange', fullscreenHandler);

        return () => {
            sessionStorage.removeItem('canPlay');
            document.removeEventListener('fullscreenchange', fullscreenHandler);
        };
    }, []);
    const [gameOver, gameOverUpdate] = useState(true);
    const [highScore, highScoreUpdate] = useState(0);
    const [totalClicks, totalClicksUpdate] = useState(0);
    const [score, scoreUpdate] = useState(0);

    return allowed ? (
        <div className={styles.gameBody}>
            {gameOver === false ?
                <Game
                    gameOverUpdate={gameOverUpdate}
                    gameOver={gameOver}
                    highScoreUpdate={highScoreUpdate}
                    highScore={highScore}
                    scoreUpdate={scoreUpdate}
                    totalClicksUpdate={totalClicksUpdate}
                /> :
                <Home
                    gameOverUpdate={gameOverUpdate}
                    totalClicks={totalClicks}
                    totalClicksUpdate={totalClicksUpdate}
                    highScore={highScore}
                    score={score}
                />
            }
        </div>


    ):null;
}
