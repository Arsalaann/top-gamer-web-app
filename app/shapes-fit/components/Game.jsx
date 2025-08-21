import styles from './Game.module.css';
import styles1 from './Shapes.module.css';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Timer from "./Timer";
import TopBar from './TopBar';

export default function Game({ gameOver, gameOverUpdate, scoreUpdate, highScoreUpdate }) {

  const controlsI = useAnimation();
  const controlsO = useAnimation();

  const middleShapes = useMemo(() => [
    "diamondMiddle",
    "squareMiddle",
    "rectangleMiddle",
    "circleMiddle"
  ], []);

  const middleEffects = useMemo(() => [
    "middleEffect1",
    "middleEffect2",
    "middleEffect3",
    "middleEffect4"
  ], []);

  const borderEffects = useMemo(() => [
    "effect1",
    "effect2",
    "effect3",
    "effect4"
  ], []);

  const [middleEffectIndex, setMiddleEffectIndex] = useState(0);
  const [tryCount, setTryCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [scoreUpdateText, scoreUpdateTextSet] = useState("");

  const [shapesOrder, setShapesOrder] = useState([
    "diamond",
    "square",
    "rectangle",
    "circle",
    "diamondMiddle" // middle slot
  ]);

  // refs for keyboard pressed states
  const isLeftKey = useRef(false);
  const isRightKey = useRef(false);
  const isUpKey = useRef(false);
  const isDownKey = useRef(false);

  // refs to keep latest state for event handlers
  const shapesOrderRef = useRef(shapesOrder);
  const middleEffectIndexRef = useRef(middleEffectIndex);
  const gameOverRef = useRef(gameOver);

  // Sync refs with latest state
  useEffect(() => {
    shapesOrderRef.current = shapesOrder;
  }, [shapesOrder]);

  useEffect(() => {
    middleEffectIndexRef.current = middleEffectIndex;
  }, [middleEffectIndex]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const gameOverHandler = () => {
    gameOverUpdate(true);
    scoreUpdate(score);
    highScoreUpdate((prev) => Math.max(score, prev));
  };

  const renderMiddleShape = (shapeName, effectName) => (
    <motion.div
      key={tryCount}
      initial={{
        scale: 1,
        rotate: shapeName === "diamondMiddle" ? 45 : 0
      }}
      animate={controlsO}
      className={`${styles1[shapeName]} ${styles1[effectName]}`}
    />
  );

  const renderShape = (shapeName, effectName) => (
    <motion.div
      key={tryCount}
      initial={{
        rotate: shapeName === "diamond" ? 45 : 0
      }}
      animate={controlsI}
      onClick={() => shapesClickHandler(shapeName)}
      className={`${styles1[shapeName]} ${styles1[effectName]}`}
    />
  );

  const shapesClickHandler = (shapeName) => {
    const order = shapesOrderRef.current;
    const currentShapeIndex = order.indexOf(shapeName);
    let x = 0, y = 0;

    switch (currentShapeIndex) {
      case 0: y = -135; break;
      case 1: x = -130; break;
      case 2: x = 130; break;
      case 3: y = 133; break;
    }

    controlsO.start({
      x,
      y,
      transition: { duration: 0.2 }
    }).then(() => {
      if (currentShapeIndex === middleEffectIndexRef.current) {
        setIsWrong(false);
        setScore((prev) => prev + 10);
        scoreUpdateTextSet("+10");
        shuffle();
      } else {
        setScore((prev) => prev - 5);
        scoreUpdateTextSet("-5");
        setIsWrong(true);
        controlsO.start({
          x: 0,
          y: 0,
          transition: { duration: 0.2 }
        }).then(() => {
          setIsWrong(false);
        });
      }
    });
  };

  useEffect(() => {
    controlsI.start({
      scale: [1, 1.03, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
      }
    });
  }, [tryCount]);

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (gameOverRef.current) return;

      if ((e.key === 'ArrowLeft' || e.key === 'a') && !isLeftKey.current) {
        shapesClickHandler(shapesOrderRef.current[1]);
        isLeftKey.current = true;
      }
      if ((e.key === 'ArrowRight' || e.key === 'd') && !isRightKey.current) {
        shapesClickHandler(shapesOrderRef.current[2]);
        isRightKey.current = true;
      }
      if ((e.key === 'ArrowUp' || e.key === 'w') && !isUpKey.current) {
        shapesClickHandler(shapesOrderRef.current[0]);
        isUpKey.current = true;
      }
      if ((e.key === 'ArrowDown' || e.key === 's') && !isDownKey.current) {
        shapesClickHandler(shapesOrderRef.current[3]);
        isDownKey.current = true;
      }
    };

    const keyUpHandler = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') isLeftKey.current = false;
      if (e.key === 'ArrowRight' || e.key === 'd') isRightKey.current = false;
      if (e.key === 'ArrowUp' || e.key === 'w') isUpKey.current = false;
      if (e.key === 'ArrowDown' || e.key === 's') isDownKey.current = false;
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  function shuffle() {
    const array = [...shapesOrder];
    let currentIndex = array.length - 1;
    let randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] =
        [array[randomIndex], array[currentIndex]];
    }

    array[4] = middleShapes[Math.floor(Math.random() * middleShapes.length)];
    setMiddleEffectIndex(array.indexOf(array[4].replace("Middle", "")));
    setShapesOrder(array);
    setTryCount(prev => prev + 1);
  }

  return (
    <div className={styles.gameContainer}>

      <motion.div
        key={Date.now()}
        initial={{ opacity: 0 }}
        animate={{ opacity: [1, 0], y: -40 }}
        transition={{ duration: 1 }}
        className={`${styles["score-update"]} ${scoreUpdateText === '+10' ? styles.scorePlus : styles.scoreMinus}`}
      >
        {scoreUpdateText}
      </motion.div>

      <TopBar score={score} gameOverHandler={gameOverHandler} />
      <Timer gameOverHandler={gameOverHandler} />

      <div className={`${styles.game} ${isWrong && styles.isWrong}`}>
        <div className={styles1.gameTop}>
          <div className={styles1.topFirst}>
            {renderShape(shapesOrder[0], borderEffects[0])}
          </div>
        </div>

        <div className={styles1.gameMiddle}>
          <div className={styles1.middleFirst}>
            {renderShape(shapesOrder[1], borderEffects[1])}
          </div>
          <div className={styles1.middleSecond}>
            {renderMiddleShape(shapesOrder[4], middleEffects[middleEffectIndex])}
          </div>
          <div className={styles1.middleThird}>
            {renderShape(shapesOrder[2], borderEffects[2])}
          </div>
        </div>

        <div className={styles1.gameBottom}>
          <div className={styles1.bottomFirst}>
            {renderShape(shapesOrder[3], borderEffects[3])}
          </div>
        </div>
      </div>
    </div>
  );
}
