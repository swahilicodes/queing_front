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

export default function Home() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const {data:queue,loading,error} = useFetchData("http://localhost:5000/tickets/getAllTickets")
    const date = new Date()
    const [adverts,setAdverts] = useState([])
    const socket = io('http://localhost:5000',{ transports: ['websocket'] });
    const router = useRouter()
    const [time, setTime] = useState(0);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    useEffect(()=> {
      getAdverts()
      checkStatus()
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

    const checkStatus = () => {
      socket.on('data', (msg) => {
        if(msg){
            console.log(msg.route)
            if(msg.route==="tickets"){
                router.reload()
            }
            //console.log(msg)
            // router.reload()
        }
      });
 }

    const getAdverts = () => {
      axios.get('http://localhost:5000/adverts/get_all_adverts').then((data)=> {
        setAdverts(data.data)
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

  // let folen
  // if(loading){
  //   folen = <div className={styles.cats_loader}>
  //     <table>
  //       <thead>
  //         <tr>
  //           <th> <div className={styles.shimmer}></div> </th>
  //           <th> <div className={styles.shimmer}></div> </th>
  //           <th> <div className={styles.shimmer}></div> </th>
  //           <th> <div className={styles.shimmer}></div> </th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           <td> <div className={styles.shimmer}></div> </td>
  //           <td> <div className={styles.shimmer}></div> </td>
  //           <td> <div className={styles.shimmer}></div> </td>
  //           <td> <div className={styles.shimmer}></div> </td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>
  // }else if(!loading && queue.length !== 0 ){
  //   folen = <div className={styles.cats}>
  //     <table>
  //       <thead>
  //       <tr>
  //       {
  //         Array.from(new Set(queue.map((item:any )=> item.category))).map((item:any,index:number)=> (
  //           <th>
  //             <div className={styles.th_item}>
  //             {item.toUpperCase()}
  //             </div>
  //           </th>
  //         ))
  //       }
  //       </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           {
  //             Array.from(new Set(queue.map((item:any,index:number)=> item.category))).map((item:any,index:number)=> (
  //               <td className={cx(index%2===0 && styles.even)}> <CatTickets category={item}/> </td>
  //             ))
  //           }
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>
  // }else{
  //   folen = <div className={styles.cats_loader}>
  //     <table>
  //       <thead>
  //         <tr>
  //           <th> <div className={styles.shimmer}></div> </th>
  //           <th> <div className={styles.shimmer}></div> </th>
  //           <th> <div className={styles.shimmer}></div> </th>
  //           <th> <div className={styles.shimmer}></div> </th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           <td> <div className={styles.shimmer}></div> </td>
  //           <td> <div className={styles.shimmer}></div> </td>
  //           <td> <div className={styles.shimmer}></div> </td>
  //           <td> <div className={styles.shimmer}></div> </td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   </div>
  // }
  return (
    <div className={styles.index}>
      <div className={styles.new_look}>
        <div className={styles.new_left}>
          <div className={styles.round}>
            <h5>Current Serving</h5>
            <h2>Token Number</h2>
            <div className={styles.token_no}>
              D002
            </div>
            <div className={styles.waiting_time}>
              <p>Waiting Time</p>
              <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <div className={styles.new_right}>
          {
            queue.length>0 
            ? <div className={styles.queue_div}>
              {
                queue.map((item:any,index:number)=> (
                  <div className={cx(styles.div)}>
                    <div className={cx(styles.indi,index===0 && styles.serving,index===1 && styles.next)}> <p>{index+1}</p> </div>
                    <div className={styles.ticket_info}>
                    <p>{item.ticket_no}</p>
                    <span>COUNTER <span>001</span> </span>
                    </div>
                  </div>
                ))
              }
            </div>
            : <div className={styles.queue_div}></div>
          }
        </div>
      </div>
      {/* {folen} */}
      {/* <div className={styles.color_expla}>
        <div className={styles.item}>
          <div className={cx(styles.color_left,styles.main)}></div>
          <div className={styles.color_right}>Namba</div>
        </div>
        <div className={styles.item}>
          <div className={cx(styles.color_left,styles.gold)}></div>
          <div className={styles.color_right}>Dirisha</div>
        </div>
        <div className={styles.item}>
          <div className={cx(styles.color_left,styles.red)}></div>
          <div className={styles.color_right}>Anahudumiwa</div>
        </div>
        <div className={styles.item}>
          <div className={cx(styles.color_left,styles.green)}></div>
          <div className={styles.color_right}>Anaefata</div>
        </div>
        <div className={styles.item}>
          <div className={cx(styles.color_left,styles.yellow)}></div>
          <div className={styles.color_right}>Kaa Tayari</div>
        </div>
      </div> */}
      <div className={styles.ads}>
        <div className={styles.ad}>
          {
            adverts.length>0 && (<AdvertScroller adverts={adverts}/>)
          }
        </div>
        <div className={styles.time}>
          MATANGAZO
          {/* <div className={styles.time_date}>{date.getDate()}/{date.getMonth()}/{date.getFullYear()}</div>
          <div className={styles.time_time}>{date.getHours().toString().padStart(2, '0')}<span>:</span>{date.getMinutes().toString().padStart(2, '0')}<span>:</span>{date.getSeconds().toString().padStart(2, '0')}</div> */}
        </div>
      </div>
    </div>
  )
}
