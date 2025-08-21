'use client';

import styles from './page.module.css';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Game from './components/Game';
import Home from './components/Home';
import Image from 'next/image';

export default function ShapesFit() {
    const [allowed,setAllowed]=useState(false);
    const [gameOver, gameOverUpdate] = useState(true);
    const [highScore, highScoreUpdate] = useState(0);
    const [score, scoreSet] = useState(0);

    const router = useRouter();
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
    return allowed?(
        <div className={styles.gameBody}>
            <div className={styles.gamePlayingBgContainer}>
                <Image
                    src='/burst-shot-playing.png'
                    alt='burst shot bg'
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>
            {!gameOver ?
                <Game
                    gameOverUpdate={gameOverUpdate}
                    highScoreUpdate={highScoreUpdate}
                    scoreSet={scoreSet}
                /> :
                <Home
                    gameOverUpdate={gameOverUpdate}
                    highScore={highScore}
                    score={score}
                    scoreSet={scoreSet}
                />
            }
        </div>


    ):null;
}
