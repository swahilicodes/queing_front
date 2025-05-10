import React, { useEffect } from 'react'
import styles from './styles.module.scss'

interface props{
    language: string,
    ticks: []
}

function AvailableServing({language,ticks}:props) {

 useEffect(()=> {
    console.log(ticks)
 },[])
  return (
    <div className={styles.available_serving}>
        <div className={styles.top}>
            <h2>{language==="Swahili"?"ANAYE HUDUMIWA SASA":"SERVING NOW"}</h2>
        </div>
      Available Serving
    </div>
  )
}

export default AvailableServing
