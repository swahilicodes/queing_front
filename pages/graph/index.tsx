import BarGraph from '@/components/graph/bar'
import BarGraphOne from '@/components/graph/barOne/BarOne'
import React, { useEffect, useState } from 'react'
import styles from './bar.module.scss'
import axios from 'axios'

function Graph() {
  const [tokens, setTokens] = useState([])
  const [token, setToken] = useState<any>({})
  useEffect(()=> {
    getTicks()
  },[])

  const getTicks = () => {
    axios.get("http://localhost:5000/analytics/token_analytics")
      .then((data: any) => {
        setToken(data.data)
        console.log(data)
        setTokens(data.data)
        // console.log(tokens.slice(0,5))
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 400) {
          console.log(`there is an error ${error.message}`);
          alert(error.response.data.error);
        } else {
          console.log(`there is an error message ${error.message}`);
          alert(error.message);
        }
      });
  };
  return (
    <div className={styles.bar}>
      <div className={styles.graph}>
        {
          tokens.map((item:any,index:number)=> (
            <div className={styles.graph_wrap}>
              <div className={styles.bar}>
              <div className={styles.completed} style={{height: `${item.completed+1 * 10}%`}}></div>
              <div className={styles.total} style={{height: `${item.total+1 * 10}%`}}></div>
              <div className={styles.uncompleted} style={{height: `${item.uncompleted+1 * 3}%`}}></div>
            </div>
            <div className={styles.label}>{item.day}</div>
            </div>
          ))
        }
      </div>
      {/* <BarGraphOne/> */}
    </div>
  )
}

export default Graph