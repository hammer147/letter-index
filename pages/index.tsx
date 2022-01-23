import type { NextPage } from 'next'
import { MouseEventHandler, useEffect, useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Modal from 'react-modal'
import styles from '../styles/Home.module.css'

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

const generateQuestion = () => {
  const entries = Array.from(LETTERS.entries())
  const randomEntry = entries[Math.floor(Math.random() * entries.length)]
  let randomKeyOrValue = randomEntry[Math.floor(Math.random() * 2)]
  if (typeof randomKeyOrValue === 'number') randomKeyOrValue = randomKeyOrValue + 1
  return randomKeyOrValue
}

Modal.setAppElement('#__next')

const Home: NextPage = () => {

  const [question, setQuestion] = useState<string | number>()
  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [reason, setReason] = useState('')
  const [key, setKey] = useState(0) // different key resets timer

  // we could set the initial question in the useState with () => generateQuestion()
  // but since this is random, we would have a difference between the server and the client because of SSR
  // this is why we use useEffect

  useEffect(() => {
    setQuestion(generateQuestion())
  }, [])


  const reset = () => {
    setQuestion(generateQuestion())
    setScore(0)
    setIsGameOver(false)
    setReason('')
    // do not reset key
  }

  const gameOver = (reason: string) => {
    console.log('game over - ', reason)
    setIsGameOver(true)
    setReason(reason)
    setKey(Math.random())
  }

  const correctAnswer = (question: number | string) => {
    if (typeof question === 'number') return LETTERS[question - 1]
    return LETTERS.indexOf(question) + 1
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = e => {
    const answer = (e.currentTarget.innerText)
    let isCorrect = false

    if (isNaN(parseInt(answer))) {
      // answer is a letter (question is a number)
      if (LETTERS.indexOf(answer) === question as number - 1) isCorrect = true
    } else {
      // answer is a number (question is a string)
      if (LETTERS[parseInt(answer) - 1] === question as string) isCorrect = true
    }

    if (isCorrect) {
      console.log('correct')
      setScore(prev => prev + 1)
      setQuestion(generateQuestion())
      setKey(Math.random())
    } else {
      gameOver('Wrong Answer')
    }

  }

  return (
    <div className={styles.container}>

      <div>Score: {score}</div>

      <div>
        <CountdownCircleTimer
          key={key}
          isPlaying={!isGameOver}
          duration={Math.max(1, 5 - Math.floor(score / 5))}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => gameOver('Out Of Time')}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>

      <div className={styles.question}>
        {question}
      </div>

      <div className={styles.answers}>
        {
          LETTERS.map((letter, i) => (
            <button onClick={handleClick} key={i}>
              {typeof question === 'number' ? letter : i + 1}
            </button>))
        }
      </div>

      <Modal
        isOpen={isGameOver}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h1>Game Over</h1>
        <h3>{`${reason}: ${question} = ${correctAnswer(question!)}`}</h3>
        <h2>Score: {score}</h2>
        <button onClick={reset}>New Game</button>
      </Modal>

    </div>
  )
}

export default Home
