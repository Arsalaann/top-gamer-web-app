'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './page.module.css';
import Home from './components/Home';
import Game from './components/Game';
import Image from 'next/image';

export default function ShapesFit() {
    const [allowed,setAllowed]=useState(false);
    const [gameOver, gameOverUpdate] = useState(true);
    const [score, scoreUpdate] = useState(0);
    const [highScore, highScoreUpdate] = useState(0);
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
            document.removeEventListener('fullscreenchange', fullscreenHandler);
        };
    }, []);


    return allowed?(
        <div className={styles.gameBody}>
            <div className={styles.gamePlayingBgContainer}>
                <Image
                    src='/shapes-fit-playing.png'
                    alt='Shapes fit playing bg'
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>
            {gameOver ?
                <Home
                    gameOverUpdate={gameOverUpdate}
                    highScore={highScore}
                    score={score}
                    scoreUpdate={scoreUpdate}
                /> :
                <Game
                    gameOverUpdate={gameOverUpdate}
                    scoreUpdate={scoreUpdate}
                    highScore={highScore}
                    highScoreUpdate={highScoreUpdate}
                    gameOver={gameOver}
                />
            }
        </div>


    ):null;
}
