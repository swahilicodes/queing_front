import React from 'react'
import styles from './home.module.scss'

function Home() {
  return (
    <div className={styles.home}>
        <div className={styles.wrap}>
            <div className={styles.logo}>
                <img src="/mnh.png" alt="" />
            </div>
        </div>
    </div>
  )
}

export default Home