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
  const [stagers, setStagers] = useState<any>([])
  const [peaks, setPeaks] = useState<any>([])
  const [clinics, setClinics] = useState<any>([])
  const [output, setOutput] = useState<any>({})
  const [fields, setFields] = useState({
    idadi: 0,
    index: 0,
    stage: "meds",
    time: "week",
    clinic: ""
  })
  useEffect(()=> {
    getTicks()
    getStagers()
    getPeaks()
    getClinics()
  },[fields.stage,fields.time, fields.clinic])

  const getTicks = () => {
    axios.get("http://192.168.30.245:5000/analytics/token_analytics")
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
  const getClinics = () => {
    axios.get("http://192.168.30.245:5000/clinic/get_clinics")
      .then((data: any) => {
        setClinics(data.data)
        console.log('clinics are ',data.data)
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

  const getPeaks = () => {
    axios.get("http://192.168.30.245:5000/analytics/peak_times",{params: {time: fields.time}})
      .then((data: any) => {
        setStagers(data.data)
        setPeaks(data.data)
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
    axios.get("http://192.168.30.245:5000/analytics/stage_analytics",{params: {stage: fields.stage,time_factor:fields.time, clinic: fields.clinic}})
      .then((data: any) => {
        setStagers(data.data)
        setTokens(data.data)
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

  const handleOut = (data:any) => {
    setOutput(data)
    console.log(output)
  }

  const createArray = (max:number) => {
    const step = max / 10;
    return Array.from({ length: 10 }, (_, index) => Math.round(step * (index + 1)));
  };
  return (
    <div className={styles.bar}>
      <div className={styles.peak_time}>
        <h1>Peak Hours</h1>
        <div className={styles.peaks}>
        {
          peaks.map((item:any,index:number)=> (
              <p>{item.hour}</p>
          ))
        }
        </div>
      </div>
      <div className={styles.day_descriptions}>
        <div className={styles.colors}>
          <div className={styles.item}>
            <div className={cx(styles.color, styles.total)}></div>
            <div className={styles.label}>Total Tickets</div>
          </div>
          <div className={styles.item}>
            <div className={cx(styles.color, styles.med)}></div>
            <div className={styles.label}>Medical Records</div>
          </div>
          <div className={styles.item}>
            <div className={cx(styles.color, styles.account)}></div>
            <div className={styles.label}>Cashier</div>
          </div>
          <div className={styles.item}>
            <div className={cx(styles.color, styles.station)}></div>
            <div className={styles.label}>Nurse Station</div>
          </div>
          <div className={styles.item}>
            <div className={cx(styles.color, styles.clinic)}></div>
            <div className={styles.label}>Doctor</div>
          </div>
        </div>
        {
          fields.time === "week"
          ? <div className={styles.array}>
            <div className={styles.time_item} key={0}>
              <div className={cx(styles.labela, styles.med)}></div>
              <div className={styles.itema}>{output.med_time}</div>
            </div>
              <div className={styles.time_item} key={1}>
              <div className={cx(styles.labela, styles.account)}></div>
              <div className={styles.itema}>{output.account_time}</div>
            </div>
              <div className={styles.time_item} key={2}>
              <div className={cx(styles.labela,styles.station)}></div>
              <div className={styles.itema}>{output.station_time}</div>
            </div>
              <div className={styles.time_item} key={3}>
              <div className={cx(styles.labela,styles.clinic)}></div>
              <div className={styles.itema}>{output.clinic_time}</div>
            </div>
          </div>
          : <div className={styles.array}>
          <div className={styles.time_item} key={0}>
          <div className={cx(styles.labela, styles.med)}></div>
          <div className={styles.itema}>{stagers[0].med_time}</div>
        </div>
          <div className={styles.time_item} key={1}>
          <div className={cx(styles.labela, styles.account)}></div>
          <div className={styles.itema}>{stagers[0].account_time}</div>
        </div>
          <div className={styles.time_item} key={2}>
          <div className={cx(styles.labela,styles.station)}></div>
          <div className={styles.itema}>{stagers[0].station_time}</div>
        </div>
          <div className={styles.time_item} key={3}>
          <div className={cx(styles.labela,styles.clinic)}></div>
          <div className={styles.itema}>{stagers[0].clinic_time}</div>
        </div>
        </div>
        }
      </div>
      <div className={styles.top_bar}>
        <div className={styles.left}>
        <div className={styles.item}>
        <label>Duration</label>
        <select
        onChange={e => setFields({...fields,time: e.target.value})}
        >
         <option value="day">Day</option>
         <option value="week">Week</option>
         <option value="month">Month</option>
         <option value="year">Year</option>
         <option value="all">All</option>
        </select>
        </div>
        <div className={styles.item}>
        <label>Clinic</label>
        <select
        onChange={e => setFields({...fields,clinic: e.target.value})}
        >
        {clinics.length > 0} && {
            clinics.map((item:any,index:number)=> (
              <option value={item.clinicicode}>{item.cliniciname}</option>
            ))
          }
        </select>
        </div>
        </div>
        <div className={styles.right}>
          <p>Total: <span>{stagers.reduce((accumulator: any, current:any) => accumulator + current.total, 0)}</span></p>
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
              <div className={styles.bar} onClick={()=> handleOut(item)}>
              {/* <div className={styles.completed} style={{height: `${(item.completed/Math.max(...stagers.map((item:any)=> item.total))) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.completed,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div> */}
              <div className={styles.total} style={{height: `${item.total/Math.max(...stagers.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.total,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
              {/* <div className={styles.uncompleted} style={{height: `${item.uncompleted/Math.max(...stagers.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.uncompleted,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div> */}
              <div className={styles.med} style={{height: `${item.med_total/Math.max(...stagers.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.med_total,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
              <div className={styles.account} style={{height: `${item.account_total/Math.max(...stagers.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.account_total,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
              <div className={styles.clinic} style={{height: `${item.clinic_total/Math.max(...stagers.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.clinic_total,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
              <div className={styles.station} style={{height: `${item.station_total/Math.max(...stagers.map((item:any)=> item.total)) * 100}%`}} onMouseEnter={()=> setFields({...fields,idadi:item.station_total,index: index})} onMouseLeave={()=> setFields({...fields,idadi:0,index: 0})}></div>
            </div>
            <div className={styles.label}>
              <div className={styles.day}>{item.day}</div>
            </div>
            </div>
          ))
        }
      </div>
      {/* <BarGraphOne/> */}
    </div>
  )
}

export default StageGraph