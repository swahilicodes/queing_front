import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import cx from 'classnames'
import AdvertScroller from '@/components/adverts/advert';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { useRecoilState } from 'recoil';
import currentConditionState from '@/store/atoms/current';
import LanguageState from '@/store/atoms/language';
import { BiCurrentLocation } from 'react-icons/bi';

export default function Home() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    //const {data:queue,loading,error} = useFetchData("https://qms-back.mloganzila.or.tz/tickets/getTickets")
    const [tickets, setTickets] = useState<any>([])
    const [adverts,setAdverts] = useState([])
    const router = useRouter()
    const [time, setTime] = useState(0);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const [condition, setCondition] = useRecoilState(currentConditionState)
    const [, setLoading] = useState(false)
    const [language,] = useRecoilState(LanguageState)
    const [blink, setBlink] = useState(false)
    const [active, setActive] = useState(false)
    //const eventSource = new EventSource('https://qms-back.mloganzila.or.tz/socket/display_tokens_stream');

    useEffect(()=> {
      getTickets()
      getAdverts()
      getActive()
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        setBlink(!blink)
        getActive()
      }, 1000);
    //   eventSource.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     console.log('Received data:', data);
    // };
    
    // eventSource.onerror = (error) => {
    //     console.error('SSE error:', error);
    // };
      // setInterval(() => {
      //   getTickets()
      //   //router.reload()
      // // }, 30000);
      // }, 30000);
      return () => {
        clearInterval(intervalId);
      }
    },[condition,blink])

    const getActive = () => {
      axios.get(`https://qms-back.mloganzila.or.tz/active/get_active`,{params: {page: "/"}})
        .then((data) => {
          setActive(data.data.isActive)
        })
        .catch((error) => {
          console.log(error.response)
          if (error.response && error.response.status === 400) {
            //console.log(`there is an error ${error.message}`);
            alert(error.response.data.error);
          } else {
            //console.log(`there is an error message ${error.message}`);
            alert(error.message);
          }
        });
    };


    const getAdverts = () => {
      axios.get('https://qms-back.mloganzila.or.tz/adverts/get_all_adverts').then((data)=> {
        setAdverts(data.data)
      }).catch((error)=> {
        alert(error)
      })
    }
    const getTickets = () => {
      setLoading(true)
      axios.get('https://qms-back.mloganzila.or.tz/tickets/get_display_tokens',{params:{stage: "meds", clinic_code: ""}}).then((data)=> {
        setTickets(data.data)
        setLoading(false)
      }).catch((error)=> {
        setLoading(false)
        alert(error)
      })
    }

  return (
    <div className={styles.index}>
      {
        !active && (
          <div className={styles.vid}>
            <video src="/videos/figma.mp4" 
            autoPlay
            loop
            muted
          />
          </div>
        )
      }
      <div className={cx(styles.top_bar,active && styles.none)}>
        <h1>{language==="English"?"HOSPITALI YA TAIFA MUHIMBILI-MLOGANZILA":"HOSPITALI YA TAIFA MUHIMBILI-MLOGANZILA"}</h1>
      </div>
      <div className={styles.new_look}>
        <div className={styles.new_left}>
          <div className={styles.round}>
            <div className={styles.current_serving}>
              <p>{language==="English"?"Anae Hudumiwa":"Anae Hudumiwa"}</p>
            </div>
            <h5>{language==="English"?"Anae Hudumiwa":"Anae Hudumiwa"}</h5>
            <h2>{language==="English"?"Namba Ya Tokeni":"Namba Ya Tokeni"}</h2>
            <div className={styles.token_no}>
              {tickets.length>0 ? tickets[0].ticket.ticket_no : "0000"}
            </div>
            <div className={styles.waiting_time}>
              <p>{language==="English"?"Muda Wa Kusubiri":"Muda Wa Kusubiri"}</p>
              <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <div className={styles.counter}>
              <p>{tickets.length>1 && tickets[1].ticket.ticket_no}</p>
              <FaArrowTrendUp className={styles.con} size={40}/>
              <span>{language==="English"?"Dirisha":"Dirisha"} <span>{tickets.length>1 ? tickets[1].counter === undefined ?"0000":tickets[1].counter.namba:"0000"}</span> </span>
            </div>
          </div>
        </div>
        <div className={styles.new_right}>
          {
            tickets.length>0 
            ? <div className={styles.queue_div}>
              {
                tickets.map((item: { ticket: { disability: string; ticket_no: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }; counter: { namba: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; } | undefined; },index:number)=> (
                  <div className={cx(styles.div,item.ticket.disability !=="" && styles.serving)} key={index}>
                    <div className={cx(styles.indi,index===0 && styles.serving,index===1 && styles.next)}> <p>{index+1}</p> </div>
                    <div className={styles.ticket_info}>
                    <p>{item.ticket.ticket_no}</p>
                    {
                      index===0 ? <div className={styles.indicator}><BiCurrentLocation className={cx(styles.con,blink && styles.blink)} size={40}/></div>
                      : <FaArrowTrendUp className={styles.con} size={40}/>
                    }
                    <span>{language==="English"?"Dirisha":"Dirisha"} <span>{item.counter===undefined?"000":item.counter.namba}</span> </span>
                    </div>
                  </div>
                ))
              }
              <div className={styles.color_description}>
                <div className={styles.color_item}>
                  <div className={styles.item} style={{backgroundColor: "red"}}></div>
                  <p>Uhitaji</p>
                </div>
                <div className={styles.color_item}>
                  <div className={styles.item} style={{backgroundColor: "#34E734"}}></div>
                  <p>Anae Hudumiwa</p>
                </div>
                <div className={styles.color_item}>
                  <div className={styles.item} style={{backgroundColor: "#FFFF00"}}></div>
                  <p>Anae Fata</p>
                </div>
                <div className={styles.color_item}>
                  <div className={styles.item} style={{backgroundColor: "#FF5D00"}}></div>
                  <p>Tokeni</p>
                </div>
              </div>
            </div>
            : <div className={styles.queue_div}>
              {
              Array.from({length: 10}).map((item,index)=> (
                <div className={styles.shimmer_top} key={index}>
                  <div className={styles.shimmer}></div>
                </div>
              ))
            }
            </div>
          }
        </div>
      </div>
      <div className={styles.ads}>
        <div className={styles.ad}>
          {
            adverts.length>0 && (<AdvertScroller adverts={adverts}/>)
          }
        </div>
        <div className={styles.time}>MATANGAZO</div>
      </div>
    </div>
  )
}
