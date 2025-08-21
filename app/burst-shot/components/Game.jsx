import { useEffect, useRef, useState } from 'react';
import { FiRefreshCcw } from "react-icons/fi";
import { RxExit } from "react-icons/rx";
import styles from './Game.module.css';


let rafId;
let score = 0;

const balloonColors = [
    "#FF6666", // red
    "#ffbb77ff", // orange
    "#e2e26dff", // yellow
    "#81ff81ff", // green
    "#7fd1d1ff", // cyan
    "#9c9cffff", // blue
    "#ff80ffff",
    "#51bc9aff",
    "#e088e2ff",
    "#38bb60ff"
];

const button = {
    x: 290,
    y: 770,
    width: 100,
    height: 60,
    text: "SHOOT"
};

const arrowPowerShow = {
    x: 420,
    y: 770,
    width: 100,
    height: 60
}

function getRandomBalloonColor() {
    return balloonColors[Math.floor(Math.random() * balloonColors.length)];
}

function drawBalloon(ctx, x, y, radius, color, number) {

    const isPortrait = window.innerHeight > window.innerWidth;

    // Adjust vertical radius
    const verticalRadius = isPortrait ? radius * 0.9 : radius * 1.7;
    // --- Balloon gradient ---
    const grad = ctx.createRadialGradient(
        x - radius * 0.1,
        y - verticalRadius * 0.1,
        radius * 0.02,
        x,
        y,
        radius
    );

    grad.addColorStop(0.01, "#ffffffff");
    grad.addColorStop(1, color);

    // --- Balloon body ---
    ctx.beginPath();
    ctx.ellipse(x, y, radius, verticalRadius, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2 - radius * 0.1;
    ctx.stroke();
    ctx.closePath();



    // --- Small subtle reflection with shadow ---
    ctx.save(); // Save state so shadow only applies here
    ctx.shadowColor = 'rgba(255, 255, 255, 0.83)'; // soft glow shadow
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.ellipse(
        x - radius * 0.45,
        y - verticalRadius * 0.70,
        radius * 0.07,          // smaller horizontal
        verticalRadius * 0.1,  // smaller vertical
        0,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'; // brighter for more contrast
    ctx.fill();
    ctx.closePath();
    ctx.restore(); // Restore to remove shadow for other shapes


    // --- Curvy string ---
    ctx.beginPath();
    ctx.moveTo(x, y + verticalRadius);
    const stringLength = radius * 0.6;
    ctx.bezierCurveTo(
        x + radius * 0.1, y + verticalRadius + stringLength * 0.3,
        x - radius * 0.1, y + verticalRadius + stringLength * 0.6,
        x, y + verticalRadius + stringLength
    );
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    // --- Number ---
    ctx.fillStyle = "#313131ff";
    ctx.font = `bold ${radius * 0.6}px Comic Sans MS, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(number, x, y);
}

let balloons = []
function generateBalloons(columns, columnWidth, canvasHeight) {
    balloons = [];
    for (let column = 0; column < columns; column++) {
        const balloonCount = Math.floor(Math.random() * 4) + 1;
        const rowsHeight = (canvasHeight - 300) / balloonCount;
        const MIN_RADIUS = 20;

        for (let cnt = 1; cnt <= balloonCount; cnt++) {
            const color = getRandomBalloonColor();
            const maxRadius = Math.max((columnWidth / 2) * 0.9, MIN_RADIUS);
            const radius = Math.floor(Math.random() * (maxRadius - MIN_RADIUS) + MIN_RADIUS);
            const number = Math.pow(Math.floor((maxRadius / radius) * 10), 2);
            const x = column * columnWidth + columnWidth / 2;
            const y = rowsHeight * cnt;

            balloons.push({ x, y, radius, color, number });
        }
    }
};


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





export default function Game({ gameOverUpdate, scoreSet, highScoreUpdate }) {

    const [arrowsCount, arrowsCountUpdate] = useState(3);
    const [skipCount, skipCountUpdate] = useState(0);
    const [isShoot, isShootUpdate] = useState(false);

    const canvasRef = useRef(null);

    const totalSkips = 3;

    const bowXRef = useRef(230); // <-- persists across renders
    const bowY = 850;
    const bowWidth = 160;
    const bowHeight = 40;

    const bottomPadding = 10;

    const isPortrait = window.innerHeight > window.innerWidth;
    const balloonVerticalRadiusOffset = isPortrait ? 0.9 : 1.7;



    useEffect(() => {
        if (arrowsCount === 0) {
            gameOverhandler();
        }
    }, [arrowsCount]);

    const gameOverhandler = () => {
        gameOverUpdate(true);
        scoreSet(score);
        highScoreUpdate((prev) => Math.max(prev, score));
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const columns = 5;
        const columnWidth = canvasWidth / columns;

        const arrowWidth = 26;
        const arrowHeight = 100;
        let arrowX = bowXRef.current + bowWidth / 2 - arrowWidth / 2;
        let arrowY = canvasHeight - arrowHeight - bottomPadding;

        let dragging = false;
        let lastPointerId = null;

        let shoot = false;
        let isHovering = false;

        let totalArrows = 3;

        const onPointerDown = (e) => {
            const pos = getPointerPos(e, canvas);

            if (
                pos.x >= button.x &&
                pos.x <= button.x + button.width &&
                pos.y >= button.y &&
                pos.y <= button.y + button.height
            ) {
                shoot = true;
                isShootUpdate(true);
            }

            if (
                pos.x >= bowXRef.current &&
                pos.x <= bowXRef.current + bowWidth &&
                pos.y >= bowY &&
                pos.y <= bowY + bowHeight
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
            const pos1 = getPointerPos(e, canvas);

            isHovering =
                pos1.x >= button.x &&
                pos1.x <= button.x + button.width &&
                pos1.y >= button.y &&
                pos1.y <= button.y + button.height;

            if (!dragging) return;
            const pos = getPointerPos(e, canvas);

            if (dragging) {
                bowXRef.current = clamp(pos.x - bowWidth / 2, 0, canvas.width - bowWidth);
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

        // Prefer Pointer Events (covers mouse, touchpad, touch)
        canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
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




        // ---- pointer helpers (fixes CSS scaling/HiDPI) ----
        const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

        function drawScore() {
            ctx.save();

            const padding = 14;
            const x = 20;
            const y = 20;
            const text = `: ${score}`;

            ctx.font = "600 28px 'Arial Rounded MT Bold', Arial, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";

            // Measure text size
            const metrics = ctx.measureText(text);
            const textWidth = metrics.width;
            const textHeight = 32;

            const boxWidth = textWidth + padding * 2;
            const boxHeight = textHeight + padding;

            // Draw rounded rectangle background
            const radius = 12;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + boxWidth - radius, y);
            ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + radius);
            ctx.lineTo(x + boxWidth, y + boxHeight - radius);
            ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - radius, y + boxHeight);
            ctx.lineTo(x + radius, y + boxHeight);
            ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();

            // Background with slight transparency
            ctx.fillStyle = "rgba(0, 26, 255, 0.6)";
            ctx.fill();

            // Draw text
            ctx.fillStyle = "white";
            ctx.fillText(text, x + padding, y + padding / 2);

            ctx.restore();
        }





        function drawButton(isHovering) {
            const { x, y, width, height, text } = button;

            // Helper to draw rounded rectangle
            function roundRect(ctx, x, y, w, h, r) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                ctx.lineTo(x + w, y + h - r);
                ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                ctx.lineTo(x + r, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
            }

            // Gradient background
            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            if (isHovering) {
                gradient.addColorStop(0, "#00d04cff"); // light green top
                gradient.addColorStop(1, "#56ff50c6"); // darker green bottom
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
            } else {
                gradient.addColorStop(0, "#00d04cff"); // light green top
                gradient.addColorStop(1, "#19803fff"); // darker green bottom
                ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
            }




            ctx.shadowBlur = 20;
            roundRect(ctx, x, y, width, height, 12);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Glossy top highlight
            const highlight = ctx.createLinearGradient(x, y, x, y + height / 2);
            highlight.addColorStop(0, "rgba(255, 255, 255, 0.24)");
            highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.save();
            ctx.clip();
            ctx.fillStyle = highlight;
            ctx.fillRect(x, y, width, height / 2);
            ctx.restore();

            // Border
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ffffffff";
            ctx.stroke();

            // Button text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 18px Impact, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, x + width / 2, y + height / 2);

            // Reset shadow
            ctx.shadowBlur = 0;
        }


        function drawArrowPower(arrowPower, shoot) {
            const { x, y, width, height } = arrowPowerShow;

            // Rounded rectangle helper
            function roundRect(ctx, x, y, w, h, r) {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                ctx.lineTo(x + w, y + h - r);
                ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                ctx.lineTo(x + r, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.closePath();
            }

            // Background gradient
            const gradient = ctx.createLinearGradient(x, y, x, y + height);
            if (shoot) {
                gradient.addColorStop(0, "#ff4949ff"); // deep blue top
                gradient.addColorStop(1, "#b83434ff");
            } else {
                gradient.addColorStop(0, "#1e3c72"); // deep blue top
                gradient.addColorStop(1, "#2a5298"); // lighter blue bottom
            }

            ctx.fillStyle = gradient;
            ctx.shadowColor = "rgba(0,0,0,0.4)";
            ctx.shadowBlur = 8;
            roundRect(ctx, x, y, width, height, 8);
            ctx.fill();

            // Text style
            ctx.shadowColor = "rgba(0,0,0,0.6)";
            ctx.shadowBlur = 4;
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 22px Impact, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(arrowPower, x + width / 2, y + height / 2);

            // Reset shadow for next drawings
            ctx.shadowBlur = 0;
        }



        let arrowSpeed = 5;
        let arrowPower = Math.floor(Math.random() * 1800) + 100;

        let scorePlusAnimation = "", arrowPowerAnimation = "";
        let hitAnimationTimer = 0;
        let scorePlusAnimationX = 0;
        let arrowPowerAnimationY = 0;
        let isScoreAnimation = false;

        const restoreArrow = () => {
            --totalArrows;
            arrowsCountUpdate((prev) => prev - 1);
            arrowPower = Math.floor(Math.random() * 1200) + 324;
            skipCountUpdate(0);
            generateBalloons(columns, columnWidth, canvasHeight);
            arrowY = canvasHeight - arrowHeight - bottomPadding;
        }

        const hitAnimation = (text, x, y, color) => {
            ctx.save();
            ctx.fillStyle = color;
            ctx.font = `bold 40px Impact, sans-serif`;
            ctx.fillText(text, x, y);
            ctx.restore();
        }

        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawScore();

            balloons.forEach((b) => drawBalloon(ctx, b.x, b.y, b.radius, b.color, b.number));

            if (bowImage.complete)
                ctx.drawImage(bowImage, bowXRef.current, bowY, bowWidth, bowHeight);


            if (!shoot)
                drawButton(isHovering);


            drawArrowPower(arrowPower, shoot);

            if (arrowImage.complete) {
                let x = (canvasWidth - columnWidth) + columnWidth / 2;
                for (let i = 1; i <= totalArrows; i++) {
                    ctx.drawImage(arrowImage, x, canvasHeight - bottomPadding - bowHeight, 6, bowHeight);
                    x += columnWidth / 8;
                }
                arrowX = bowXRef.current + bowWidth / 2 - arrowWidth / 2;
                ctx.drawImage(arrowImage, arrowX, arrowY, 10, arrowHeight);

                if (shoot) {
                    arrowY -= arrowSpeed;
                    for (let i = balloons.length - 1; i >= 0; i--) {
                        if (arrowX >= balloons[i].x - balloons[i].radius &&
                            arrowX <= balloons[i].x + balloons[i].radius &&
                            arrowY <= balloons[i].y + balloons[i].radius * balloonVerticalRadiusOffset
                        ) {
                            arrowPowerAnimation = '-' + Math.min(arrowPower, balloons[i].number);
                            arrowPowerAnimationY = arrowY + arrowHeight;
                            hitAnimationTimer = 40;
                            if (arrowPower < balloons[i].number) {
                                setTimeout(() => {
                                    restoreArrow();
                                }, 1000);
                                shoot = false;
                                isShootUpdate(false);
                                break;
                            } else {
                                arrowPower -= balloons[i].number;
                                isScoreAnimation = true;
                                score += balloons[i].number;
                                scorePlusAnimation = "+" + balloons[i].number;
                                scorePlusAnimationX = 150;
                                balloons.splice(i, 1);
                            }
                        }
                    }

                    if (arrowY <= 0) {
                        setTimeout(() => {
                            restoreArrow();
                        }, 1000);
                        isShootUpdate(false);
                        shoot = false;
                    }

                    if (--hitAnimationTimer > 0) {
                        ctx.save();
                        if (isScoreAnimation)
                            hitAnimation(scorePlusAnimation, scorePlusAnimationX, 45, 'lightgreen');
                        hitAnimation(arrowPowerAnimation, arrowX, arrowPowerAnimationY, 'crimson');
                        --scorePlusAnimationX;
                        --arrowPowerAnimationY;
                    } else {
                        isScoreAnimation = false;
                    }

                }
            }

            if (!shoot) {
                ctx.save();
                ctx.strokeStyle = "#ff0000ff";
                ctx.setLineDash([5, 5]); // dashed pattern: 5px dash, 5px gap
                ctx.beginPath();
                ctx.moveTo(arrowX + 5, canvasHeight - bottomPadding);
                ctx.lineTo(arrowX + 5, 0);
                ctx.stroke();
                ctx.restore();

            }

            ctx.fillStyle = '#0000002b';
            ctx.fillRect(0, canvasHeight - bowHeight - bottomPadding, canvasWidth, bowHeight + bottomPadding);
            rafId = requestAnimationFrame(gameLoop);
        };

        const startGame = () => {
            generateBalloons(columns, columnWidth, canvasHeight);
            gameLoop();
        };

        // ---- images ----
        let imagesLoaded = 0;
        const checkAllImagesLoaded = () => {
            imagesLoaded++;
            if (imagesLoaded === 2) startGame();
        };

        const bowImage = new Image();
        const arrowImage = new Image();
        bowImage.onload = checkAllImagesLoaded;
        arrowImage.onload = checkAllImagesLoaded;
        bowImage.src = '/bow.png';
        arrowImage.src = '/arrow.png';

        // ---- cleanup ----
        return () => {
            score = 0;
            cancelAnimationFrame(rafId);
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

        };
    }, []);
    return (
        <div className={styles.gameContainer}>
            <div className={styles['exit']}>
                <RxExit onClick={gameOverhandler} />
            </div>
            {!isShoot &&
                <div className={styles.skipContainer}>
                    <div>({skipCount}\{totalSkips})</div>
                    <FiRefreshCcw
                        onClick={() => {
                            if (skipCount < totalSkips) {
                                skipCountUpdate((prev) => prev + 1);
                                generateBalloons(5, 160, 900);
                            }
                        }}
                        className={styles.refreshDrawing}
                    />
                </div>
            }


            <canvas
                className={styles.gameCanvas}
                width={800}
                height={900}
                ref={canvasRef}
            />
        </div>

    )
}