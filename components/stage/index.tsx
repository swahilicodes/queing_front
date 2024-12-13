import BarGraph from '@/components/graph/bar'
import BarGraphOne from '@/components/graph/barOne/BarOne'
import React, { useEffect, useState } from 'react'
import styles from './bar.module.scss'
import axios from 'axios'
import cx from 'classnames'
import { useSetRecoilState } from 'recoil'
import messageState from '@/store/atoms/message'

function StageGraph() {
  const [tokens, setTokens] = useState([])
  const [token, setToken] = useState<any>({})
  const setMessage = useSetRecoilState(messageState)
  const [stagers, setStagers] = useState([])
  const [fields, setFields] = useState({
    idadi: 0,
    index: 0,
    stage: "meds",
    time: "week",
  })
  useEffect(()=> {
    getTicks()
    getStagers()
  },[fields.stage,fields.time])

  const getTicks = () => {
    axios.get("http://localhost:5000/analytics/token_analytics")
      .then((data: any) => {
        setToken(data.data)
        //console.log(data)
        setTokens(data.data)
        // console.log(tokens.slice(0,5))
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 400) {
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };
  const getStagers = () => {
    axios.get("http://localhost:5000/analytics/stage_analytics",{params: {stage: fields.stage,time_factor:fields.time}})
      .then((data: any) => {
        setStagers(data.data)
        console.log(data)
        setTokens(data.data)
        // console.log(tokens.slice(0,5))
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 400) {
          setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
          setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
      });
  };

  const createArray = (max:number) => {
    const step = max / 10;
    return Array.from({ length: 10 }, (_, index) => Math.round(step * (index + 1)));
  };
  return (
    <div className={styles.bar}>
      <div className={styles.top_bar}>
        <div className={styles.left}>
        <div className={styles.item}>
        <label>Stage</label>
        <select
        onChange={e => setFields({...fields,stage: e.target.value})}
        >
         <option value="meds">Medical Records</option>
         <option value="accounts">Cashier</option>
         <option value="nurse_station">Nurse Station</option>
         <option value="clinic">Doctor</option>
        </select>
        </div>
        <div className={styles.item}>
        <label>Duration</label>
        <select
        onChange={e => setFields({...fields,time: e.target.value})}
        >
         <option value="week">Week</option>
         <option value="month">Month</option>
         <option value="year">Year</option>
        </select>
        </div>
        </div>
        <div className={styles.right}>
          <p>Total: <span>{stagers.reduce((accumulator, current:any) => accumulator + current.total, 0)}</span></p>
        </div>
      </div>
      <div className={styles.graph}>
      <div className={styles.x_axis}>
        {
          createArray(Math.max(...stagers.map((item:any)=> item.total))).reverse().map((item,index)=> (
            <h1 key={index}>{item}</h1>
          ))
        }
      </div>
        {
          stagers.map((item:any,index:number)=> (
            <div className={styles.graph_wrap}>
              <div className={cx(styles.idadi,fields.idadi !== 0 && fields.index===index && styles.active)}>{fields.idadi}</div>
              <div className={styles.bar}>
              <div className={styles.completed} style={{height: `${(item.completed/Math.max(...stagers.map((item:any)=> item.total))) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.completed,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
              <div className={styles.total} style={{height: `${item.total/Math.max(...stagers.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.total,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
              <div className={styles.uncompleted} style={{height: `${item.uncompleted/Math.max(...stagers.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.uncompleted,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
            </div>
            <div className={styles.label}>{item.day},{item.diff_time}</div>
            </div>
          ))
        }
      </div>
      {/* <BarGraphOne/> */}
    </div>
  )
}

export default StageGraph