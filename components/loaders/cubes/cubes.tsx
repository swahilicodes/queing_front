import React from 'react'
import styles from './cubes.module.scss'

function Cubes() {
  return (
    <div className={styles.cubes}>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
    </div>
  )
}

export default Cubes