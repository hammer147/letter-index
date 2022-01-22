import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import styles from '../styles/Home.module.css'


const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const INDICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]

const generateQuestion = () => {
  const arr = [...LETTERS, ...INDICES]
  return arr[Math.floor(Math.random() * arr.length)]
}

const Home: NextPage = () => {

  const [question, setQuestion] = useState<string | number>()
  const [score, setScore] = useState(0)

  // we could set the initial question in the useState with () => generateQuestion()
  // but since this is random, we would have a difference between the server and the client because of SSR
  // this is why we use useEffect

  useEffect(() => {
    setQuestion(generateQuestion())
  }, [])


  return (
    <div className={styles.container}>

      <div>Score: {score} / 25</div>

      <div>
        <CountdownCircleTimer
          isPlaying
          duration={7}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>

      <div className={styles.question}>
        {question}
      </div>

      <div className={styles.answers}>
        {typeof question === 'number' ? (
          LETTERS.map((letter,i) => <button key={i}>{letter}</button>)
        ) : INDICES.map((index,i) => <button key={i}>{index}</button>)}
      </div>

    </div>
  )
}

export default Home
