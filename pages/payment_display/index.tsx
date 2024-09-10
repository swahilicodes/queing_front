import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { MdZoomInMap } from 'react-icons/md';
import useFetchData from '@/custom_hooks/fetch';
import CatTickets from '@/components/cat_tickets/cat_tickets';
import cx from 'classnames'
import AdvertScroller from '@/components/adverts/advert';
import axios from 'axios';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { FaArrowTrendUp } from 'react-icons/fa6';

export default function Home() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    //const {data:queue,loading,error} = useFetchData("http://localhost:5000/tickets/getAllTickets")
    const {data:queue,loading,error} = useFetchData("http://localhost:5000/tickets/getTickets")
    const [tickets, setTickets] = useState<any>([])
    const date = new Date()
    const [adverts,setAdverts] = useState([])
    // const socket = io('http://localhost:5000',{ transports: ['websocket'] });
    const router = useRouter()
    const [time, setTime] = useState(0);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    useEffect(()=> {
      getTickets()
      getAdverts()
      // checkStatus()
      if(loading){
        console.log('loading...')
      }else{
        console.log('loading data',queue)
      }
      // socket.on('connect', () => {
      //   console.log('Connected to Socket.io server');
      //   });
    
      //   return () => {
      //   socket.disconnect();
      //   };
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
  
      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    },[])

//     const checkStatus = () => {
//       socket.on('data', (msg) => {
//         if(msg){
//             console.log(msg.route)
//             if(msg.route==="tickets"){
//                 router.reload()
//             }
//             //console.log(msg)
//             // router.reload()
//         }
//       });
//  }

    const getAdverts = () => {
      axios.get('http://localhost:5000/adverts/get_all_adverts').then((data)=> {
        setAdverts(data.data)
      }).catch((error)=> {
        alert(error)
      })
    }
    const getTickets = () => {
      axios.get('http://localhost:5000/patients/getPatientTickets',{params: {stage:"payment"}}).then((data)=> {
        setTickets(data.data)
        console.log(data.data)
      }).catch((error)=> {
        alert(error)
      })
    }

    const toggleFullScreen = () => {
     const element:any = document.documentElement;
      if (!isFullScreen) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (element.mozRequestFullScreen) { /* Firefox */
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE/Edge */
          element.msRequestFullscreen();
        }
      } else {
        if (element.exitFullscreen) {
          element.exitFullscreen();
        } else if (element.mozCancelFullScreen) { /* Firefox */
          element.mozCancelFullScreen();
        } else if (element.webkitExitFullscreen) { /* Chrome, Safari and Opera */
          element.webkitExitFullscreen();
        } else if (element.msExitFullscreen) { /* IE/Edge */
          element.msExitFullscreen();
        }
      }
      setIsFullScreen(!isFullScreen);
    };
  return (
    <div className={styles.index}>
      <div className={styles.top_bar}>
        <h1>MUHIMBILI NATIONAL HOSPITAL-MLOGANZILA</h1>
        <div className={styles.date}>Thursday 19 june 2024 10:30:50 Pm</div>
      </div>
      <div className={styles.new_look}>
        <div className={styles.new_left}>
          <div className={styles.round}>
            <div className={styles.current_serving}>
              <p>Current Serving</p>
            </div>
            <h5>Current Serving</h5>
            <h2>Token Number</h2>
            <div className={styles.token_no}>
              {tickets.length>0 ? tickets[0].ticket.mr_no : "0000"}
            </div>
            <div className={styles.waiting_time}>
              <p>Waiting Time</p>
              <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <div className={styles.counter}>
              <p>{tickets.length>0 ? tickets[0].ticket.mr_no: "0000"}</p>
              <FaArrowTrendUp className={styles.con} size={40}/>
              <span>COUNTER <span>{tickets.length>0 ? tickets[0].counter === undefined ?"0000":tickets[0].counter.namba:"0000"}</span> </span>
            </div>
          </div>
        </div>
        <div className={styles.new_right}>
          {
            tickets.length>0 
            ? <div className={styles.queue_div}>
              {
                tickets.map((item:any,index:number)=> (
                  <div className={cx(styles.div,index===0 && styles.serving,index===1 && styles.next)}>
                    <div className={cx(styles.indi,index===0 && styles.serving,index===1 && styles.next)}> <p>{index+1}</p> </div>
                    <div className={styles.ticket_info}>
                    <p>{item.ticket.mr_no}</p>
                    <FaArrowTrendUp className={styles.con} size={40}/>
                    <span>COUNTER <span>{item.counter.namba}</span> </span>
                    </div>
                  </div>
                ))
              }
            </div>
            : <div className={styles.queue_div}>
            {
              Array.from({length: 10}).map((item:any,index)=> (
                <div className={styles.shimmer_top}>
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
