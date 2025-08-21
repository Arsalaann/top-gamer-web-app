import Navigation from "./components/Navigation";
import CurrentSelection from "./components/CurrentSelection";
import RightAside from "./components/RightAside";
import styles from "./page.module.css";

function getDateTime() {
    const now = new Date();

    const date = now.toLocaleDateString(); // e.g. "8/17/2025"
    const time = now.toLocaleTimeString(); // e.g. "4:25:13 PM"

    return { date, time };
}
  
const navLinks = [
  {
    name: 'Home',
  }, 
  {
    name: 'Catch Master',
    desc: '“Grab Apples, Dodge stones!”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Burst Shot',
    desc: '“Analyze, Aim and Shoot!”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Shapes Fit',
    desc: '“Shape match, Time clash”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Be Careful',
    desc: '“Think before you click:)”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    }, //in seconds
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged in increasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Catch Master',
    desc: '“Grab Apples, Dodge stones!”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Burst Shot',
    desc: '“Analyze, Aim and Shoot!”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Shapes Fit',
    desc: '“Shape match, Time clash”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Be Careful',
    desc: '“Think before you click:)”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    }, //in seconds
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged in increasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Catch Master',
    desc: '“Grab Apples, Dodge stones!”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Burst Shot',
    desc: '“Analyze, Aim and Shoot!”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Shapes Fit',
    desc: '“Shape match, Time clash”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Be Careful',
    desc: '“Think before you click:)”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    }, //in seconds
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged in increasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Catch Master',
    desc: '“Grab Apples, Dodge stones!”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Burst Shot',
    desc: '“Analyze, Aim and Shoot!”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Shapes Fit',
    desc: '“Shape match, Time clash”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    },
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged decreasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },
  {
    name: 'Be Careful',
    desc: '“Think before you click:)”',
    highScore: {
      score: 99999,
      playerName: 'arsalan',
      country: 'India'
    }, //in seconds
    yourHistory: [
      [getDateTime().date, getDateTime().time, 1111],//arranged in increasing order of score
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111],
      [getDateTime().date, getDateTime().time, 1111]
    ]
  },

];


export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <Navigation navLinks={navLinks}/>
      <CurrentSelection navLinks={navLinks}/>
      <RightAside navLinks={navLinks}/>
    </div >
  )
}
