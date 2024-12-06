import BarGraph from '@/components/graph/bar'
import BarGraphOne from '@/components/graph/barOne/BarOne'
import React, { useEffect, useState } from 'react'
import styles from './bar.module.scss'
import axios from 'axios'
import cx from 'classnames'

function Graph() {
  const [tokens, setTokens] = useState([])
  const [token, setToken] = useState<any>({})
  const [fields, setFields] = useState({
    idadi: 0,
    index: 0
  })
  useEffect(()=> {
    getTicks()
  },[])

  const getTicks = () => {
    axios.get("http://192.168.30.245:5000/analytics/token_analytics")
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

  const createArray = (max:number) => {
    const step = max / 10;
    return Array.from({ length: 10 }, (_, index) => Math.round(step * (index + 1)));
  };
  return (
    <div className={styles.bar}>
      <div className={styles.graph}>
      <div className={styles.x_axis}>
        {
          createArray(Math.max(...tokens.map((item:any)=> item.total))).reverse().map((item,index)=> (
            <h1 key={index}>{item}</h1>
          ))
        }
      </div>
        {
          tokens.map((item:any,index:number)=> (
            <div className={styles.graph_wrap}>
              <div className={cx(styles.idadi,fields.idadi !== 0 && fields.index===index && styles.active)}>{fields.idadi}</div>
              <div className={styles.bar}>
              <div className={styles.completed} style={{height: `${(item.completed/Math.max(...tokens.map((item:any)=> item.total))) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.completed,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
              <div className={styles.total} style={{height: `${item.total/Math.max(...tokens.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.total,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
              <div className={styles.uncompleted} style={{height: `${item.uncompleted/Math.max(...tokens.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.uncompleted,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
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