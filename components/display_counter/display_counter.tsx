import React from 'react'
import styles from './styles.module.scss'

interface CounterProps{
    ticket_counter: number,
    counter_counter: number,
    serving: boolean

}

function DisplayCounter({ticket_counter, counter_counter, serving}:CounterProps) {
  return (
    <div>
      {
        serving
        ? <div className={styles.serving_counter}>
            {
                serving
                ? ticket_counter
                : "000"
            }
        </div>
        : <div className={styles.counter_counter}>
            {
                counter_counter===null
                ? "000"
                : counter_counter
            }
        </div>
      }
    </div>
  )
}

export default DisplayCounter
