import React, { useEffect, useState } from 'react'
import styles from "./styles.module.scss"
import cx from 'classnames'
import { BsStopwatch } from 'react-icons/bs';

function CurrentTime({savs}:any) {
const [currentIndex, setCurrentIndex] = useState(0)
const formatTime = (unit: string) => {
  return String(unit).padStart(2, '0')
}
const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setSeconds((prevSeconds) => {
      if (prevSeconds === 59) {
        setMinutes((prevMinutes) => {
          if (prevMinutes === 59) {
            setHours((prevHours) => prevHours + 1);
            return 0;
          }
          return prevMinutes + 1;
        });
        return 0;
      }
      return prevSeconds + 1;
    });
  }, 1000);
    const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % savs.length);
    }, 4000); // 4 seconds
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
    }, []);
  return (
    <div className={styles.current_serving}>
      {savs.map((item:any,index:number)=> (
        <div className={cx(styles.counter,currentIndex===index && styles.active)}>
        <div className={styles.stop}>
          <div className={styles.stopa_wrap}>
            <BsStopwatch size={45} className={styles.stop_watch} />
          </div>
        </div>
        <div className={styles.stopa_time}>
          {`${formatTime(hours.toString())}:${formatTime(minutes.toString())}:${formatTime(seconds.toString())}`}
        </div>
      </div>
        // <div className={cx(styles.namba,currentIndex===index && styles.active)}>
        //     <p>{item.ticket.ticket_no}</p>
        // </div>
      ))}
    </div>
  )
}

export default CurrentTime
