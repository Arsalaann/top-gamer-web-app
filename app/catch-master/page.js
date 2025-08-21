'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { game, startSpawner, startTimer } from './utils';
import { handleFullscreenChange, handleKeyDown, handleKeyUp } from './events';
import Home from './Home';

const getPointerPos = (evt, canvas) => {
    const rect = canvas.getBoundingClientRect();
    // scale to canvas coordinate space
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = 'clientX' in evt ? evt.clientX : evt.touches[0].clientX;
    const clientY = 'clientY' in evt ? evt.clientY : evt.touches[0].clientY;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
    };
};

export default function CatchMaster() {
    const [allowed, setAllowed] = useState(false);
    const router = useRouter();
    const [gameOver, gameOverUpdate] = useState(true);
    const canvasRef = useRef(null);
    const highScoreRef = useRef(0);
    const scoreRef = useRef(0);
    const keys = useRef({
        left: false,
        right: false,
    })
    const gameOverRef = useRef(gameOver);
    const basketXref = useRef(0);

    useEffect(() => {
        const canPlay = sessionStorage.getItem('canPlay');
        if (!canPlay)
            router.replace('/not-found');
        else
            setAllowed(true);
        return () => sessionStorage.removeItem('canPlay');
    }, []);

    let imagesLoaded = 0;
    useEffect(() => {
        const fullscreenHandler = () => handleFullscreenChange(gameOverRef, router);
        const keyDownHandler = (e) => handleKeyDown(e, keys.current);
        const keyUpHandler = (e) => handleKeyUp(e, keys.current);

        document.addEventListener('fullscreenchange', fullscreenHandler);
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);



        return () => {
            document.removeEventListener('fullscreenchange', fullscreenHandler);
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        }
    }, []);

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    let gameIntervals = {
        spawnInterval: null,
        timerInterval: null
    }



    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        let basketY = 770, basketWidth = 240, basketHeight = 130, basketSpeed = 15;
        let dragging = false;
        let lastPointerId = null;
        const onPointerDown = (e) => {
            const pos = getPointerPos(e, canvas);
            if (
                pos.x >= basketXref.current &&
                pos.x <= basketXref.current + basketWidth &&
                pos.y >= basketY &&
                pos.y <= basketY + basketHeight
            ) {
                dragging = true;
            }

            if (dragging) {
                if ('pointerId' in e && canvas.setPointerCapture) {
                    lastPointerId = e.pointerId;
                    canvas.setPointerCapture(e.pointerId);
                }
                e.preventDefault?.();
            }
        };

        const onPointerMove = (e) => {
            if (!dragging) return;
            const pos = getPointerPos(e, canvas);

            if (dragging) {
                basketXref.current = clamp(pos.x - basketWidth / 2, 0, canvas.width - basketWidth);
                e.preventDefault?.();
            }
        };

        const onPointerUp = (e) => {
            dragging = false;

            if (lastPointerId != null && canvas.releasePointerCapture) {
                try { canvas.releasePointerCapture(lastPointerId); } catch { }
                lastPointerId = null;
            }
        };


        canvas.addEventListener('pointermove', onPointerMove, { passive: false });
        canvas.addEventListener('pointerup', onPointerUp);
        canvas.addEventListener('pointercancel', onPointerUp);
        // Fallback for older browsers (optional)
        canvas.addEventListener('mousedown', onPointerDown);
        canvas.addEventListener('mousemove', onPointerMove);
        canvas.addEventListener('mouseup', onPointerUp);
        canvas.addEventListener('touchstart', onPointerDown, { passive: false });
        canvas.addEventListener('touchmove', onPointerMove, { passive: false });
        canvas.addEventListener('touchend', onPointerUp);






        if (!gameOver) {
            const gameLoop = () => {
                console.log('start-game')
                game(ctx, keys.current, gameBgImage,
                    canvasWidth, canvasHeight, basketImage, appleImage, stoneImage, goldenAppleImage,
                    comboImage, gameOverRef, highScoreRef, scoreRef, basketXref, basketY, basketHeight, basketSpeed, basketWidth
                );
                if (!gameOverRef.current)
                    requestAnimationFrame(gameLoop);
            };


            const startGame = () => {
                startSpawner(gameIntervals);
                startTimer(gameIntervals, gameOverRef, gameOverUpdate);
                requestAnimationFrame(gameLoop);
            }

            startGame();

        }





        const checkAllImagesLoaded = () => {
            imagesLoaded++;
        };

        const appleImage = new Image();
        const basketImage = new Image();
        const gameBgImage = new Image();
        const goldenAppleImage = new Image();
        const stoneImage = new Image();
        const comboImage = new Image();


        appleImage.onload = checkAllImagesLoaded;
        basketImage.onload = checkAllImagesLoaded;
        gameBgImage.onload = checkAllImagesLoaded;
        goldenAppleImage.onload = checkAllImagesLoaded;
        stoneImage.onload = checkAllImagesLoaded;
        comboImage.onload = checkAllImagesLoaded;

        appleImage.src = '/apple.png';
        basketImage.src = '/basket.png';
        gameBgImage.src = '/catch-master-playing.png';
        goldenAppleImage.src = '/golden-apple.png';
        stoneImage.src = '/stone.png';
        comboImage.src = '/combo.png';
        return () => {
            canvas.removeEventListener('pointerdown', onPointerDown);
            canvas.removeEventListener('pointermove', onPointerMove);
            canvas.removeEventListener('pointerup', onPointerUp);
            canvas.removeEventListener('pointercancel', onPointerUp);
            canvas.removeEventListener('mousedown', onPointerDown);
            canvas.removeEventListener('mousemove', onPointerMove);
            canvas.removeEventListener('mouseup', onPointerUp);
            canvas.removeEventListener('touchstart', onPointerDown);
            canvas.removeEventListener('touchmove', onPointerMove);
            canvas.removeEventListener('touchend', onPointerUp);
            clearInterval(gameIntervals.spawnInterval);
            clearInterval(gameIntervals.timerInterval);
        }
    }, [gameOver]);

















    return allowed ? (
        <div className={styles.gameContainer}>
            {gameOver ?
                <Home
                    gameOverRef={gameOverRef}
                    gameOverUpdate={gameOverUpdate}
                    highScore={highScoreRef.current}
                    score={scoreRef}
                /> :
                <canvas
                    className={styles.gameCanvas}
                    width={800}
                    height={900}
                    ref={canvasRef}
                />
            }
        </div>
    ) : null;
}
