import React, { useEffect, useState } from 'react'
import styles from "./styles.module.scss"
import cx from 'classnames'

function CurrentServing({savs}:any) {
const [currentIndex, setCurrentIndex] = useState(0)

useEffect(() => {
    const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % savs.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval); // Clean up on unmount
    }, []);
  return (
    <div className={styles.current_serving}>
      {savs.map((item:any,index:number)=> (
        <div className={cx(styles.namba,currentIndex===index && styles.active)}>
            <p>{item.ticket.ticket_no}</p>
        </div>
      ))}
    </div>
  )
}

export default CurrentServing
