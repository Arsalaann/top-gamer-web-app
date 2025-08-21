const basket = {
    x: 0,
    y: 770,
    width: 240,
    height: 130,
    speed: 15
};



let items = [];
let timeLeft = 15;
let combo = 0, comboY = 425, wasStone = false;
let comboYCurrent = comboY, comboSpeed = 1;
let glowTimer = 0, isRed = true;
let vibrateTimer = 0, vibrateOffset = 0;

function reset() {
    items = [];
    timeLeft = 15;
    combo = 0, wasStone = false;
    comboYCurrent = comboY, isRed = true;
}

export function startSpawner(gameIntervals) {
    clearInterval(gameIntervals.spawnInterval); // Always clear previous interval to avoid duplicates
    gameIntervals.spawnInterval = setInterval(() => {
        const rnd = Math.floor(Math.random() * 10);

        let item_name;
        const isPortrait = window.innerHeight > window.innerWidth;
        const baseSpeed = isPortrait
            ? (window.innerHeight * 0.001)+Math.random()*3  // slower for tall screens
            : (window.innerHeight * 0.006)+Math.random()*4; // normal for landscape
        if (rnd === 0)
            item_name = 'stone';
        else if (rnd % 4 === 0)
            item_name = 'golden-apple';
        else
            item_name = 'apple';

        items.push({
            x: Math.floor(Math.random() * 10) * 80,
            y: -120,
            width: 80,
            height: 80,
            speed: baseSpeed,
            item_name: item_name
        });
    }, 500);
}

export function startTimer(gameIntervals, gameOver, gameOverUpdate) {
    clearInterval(gameIntervals.timerInterval); // Always clear any existing interval first (to avoid duplicates)
    reset();
    gameIntervals.timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            gameOver.current = true;
            gameOverUpdate(true);
            clearInterval(gameIntervals.spawnInterval);
            clearInterval(gameIntervals.timerInterval);
            console.log("Game Over");
        }
    }, 1000);
}


export function game(ctx, keys, gameBgImage,
    canvasWidth, canvasHeight, basketImage, appleImage, stoneImage, goldenAppleImage,
    comboImage, gameOver, highScore, score, basketXref, basketY, basketHeight, basketSpeed, basketWidth) {

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (keys.left) {
        if (basketXref.current <= 0)
            basketXref.current = 0;
        else
            basketXref.current -= basketSpeed;
    }
    if (keys.right) {
        if (basketXref.current >= canvasWidth - basketWidth)
            basketXref.current = canvasWidth - basketWidth
        else
            basketXref.current += basketSpeed;
    }


    if (gameBgImage.complete) {
        ctx.drawImage(gameBgImage, 0, 0, canvasWidth, canvasHeight);
    }

    function drawInfoBox(x, y, width, height, text, combo) {
        ctx.fillStyle = combo && combo > 1 ? 'navy' : 'rgba(0, 0, 0, 0.6)'; // semi-transparent black
        ctx.strokeStyle = combo && combo > 1 ? 'white' : 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const radius = 10;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(text, x + width / 2, y + height / 2);
        ctx.shadowBlur = 0; // reset
    }

    drawInfoBox(20, 10, 170, 40, `Time: ${timeLeft}s`);
    drawInfoBox(580, 10, 200, 40, `score: ${score.current}`, combo);
    drawInfoBox(280, 10, 200, 40, `${highScore.current}`);

    if (glowTimer > 0) {
        ctx.save();
        ctx.shadowColor = isRed ? 'red' : 'yellow';     // Glow color
        ctx.shadowBlur = isRed ? 20 : 30;
        ctx.drawImage(basketImage, basketXref.current, basketY, basketWidth, basketHeight);
        ctx.restore();
        glowTimer--;
    } else {
        let basketX = basketXref.current;
        if (vibrateTimer > 0) {
            vibrateOffset = (vibrateTimer % 2 === 0) ? -3 : 3;
            basketX += vibrateOffset;
            vibrateTimer--;
        }
        ctx.save();
        ctx.shadowColor = 'brown';     // Glow color
        ctx.shadowBlur = 30;
        ctx.drawImage(basketImage, basketX, basketY, basketWidth, basketHeight);
        ctx.restore();
    }


    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        if (item.item_name === 'apple') {
            if (appleImage.complete)
                ctx.drawImage(appleImage, item.x, item.y, item.width, item.height);
        }
        else if (item.item_name === 'stone') {
            if (stoneImage.complete)
                ctx.drawImage(stoneImage, item.x, item.y, item.width, item.height);
        }
        else {
            if (goldenAppleImage.complete) {
                ctx.save();
                ctx.shadowColor = 'yellow';     // Glow color
                ctx.shadowBlur = 30;
                ctx.drawImage(goldenAppleImage, item.x, item.y, item.width, item.height);
                ctx.restore();
            }
        }

        if (item.y > canvasHeight) {
            items.splice(i, 1); // Safe in reverse loop
            if (item.item_name !== 'stone')
                combo = 0, wasStone = false, comboYCurrent = comboY;
            else
                wasStone = true;
        }

        //basket can catch even half visible apple and
        //can catch an apple with a half margin away from basket width
        if (item.y >= basketY - item.height &&
            item.y < basketY + (item.height / 2) &&
            item.x + (item.width / 2) >= basketXref.current && item.x + (item.width / 2) <= basketXref.current + basketWidth
        ) {
            if (item.item_name === 'apple') {
                combo++;
                score.current += 10 * combo;
                wasStone = false;
                comboYCurrent = comboY;
                glowTimer = 5;
                isRed = true;
            }
            else if (item.item_name === 'stone') {
                score.current = Math.floor(score.current / 2);
                wasStone = true;
                vibrateTimer = 6;
            }
            else {
                combo++;
                combo *= 2;
                score.current += 100 * combo;
                wasStone = false;
                comboYCurrent = comboY;
                glowTimer = 10;
                isRed = false;
            }
            highScore.current = Math.max(highScore.current, score.current);
            items.splice(i, 1);
        }
    }

    if (combo > 1 && wasStone === false) {
        comboYCurrent -= comboSpeed;
        if (comboYCurrent > 125) {
            if (comboImage.complete) {
                ctx.drawImage(comboImage, 275, comboYCurrent, 250, 50);
                ctx.font = 'bold 54px "Segoe UI", sans-serif';
                ctx.lineWidth = 10; // Border thickness
                ctx.strokeStyle = 'navy'; // Border color
                ctx.strokeText(combo, 400, comboYCurrent + 90);
                ctx.fillStyle = 'gold';
                ctx.fillText(combo, 400, comboYCurrent + 90);

            }
        }
    }

    if (gameOver.current) {
        return;
    }
}

