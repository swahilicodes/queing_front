import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { MdZoomInMap } from 'react-icons/md';
import useFetchData from '@/custom_hooks/fetch';

export default function Home() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const {data:queue,loading,error} = useFetchData("http://localhost:5000/tickets/getTickets")
    const [cats,setCats] = useState<any>([])

    useEffect(()=> {
      console.log(queue)
    })

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

  let folen
  if(loading){
    folen = <p>loading...</p>
  }else if(!loading && queue.length !== 0 ){
    folen = <div className={styles.cats}>
      <table>
        <thead>
        <tr>
        {
          Array.from(new Set(queue.map((item:any )=> item.category))).map((item:any,index:number)=> (
            <th>{item}</th>
          ))
        }
        </tr>
        </thead>
        <tbody>
          <tr>
            {
              Array.from(new Set(queue.map((item:any )=> item.category))).map((item:any,index:number)=> (
                <td>{item}</td>
              ))
            }
          </tr>
        </tbody>
      </table>
    </div>
  }else{
    folen = <p>ashalalaaaaaaaa</p>
  }
  return (
    <div className={styles.index}>
      {folen}
      {/* <div className={styles.top_home_comp}>
        <h1>MUHIMBILI NATIONAL HOSPITAL MLOGANZILA</h1>
      </div> */}
      {/* <div className={styles.home_comp_body}>
        <div className={styles.home_comp_body_left}>
          <h1>001</h1>
        </div>
        <div className={styles.home_comp_body_right}>
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                queue.map((item:any,index:number)=> (
                  <tr key={index}>
                    <td>{item.ticket_no}</td>
                    <td>{item.category}</td>
                    <td className={styles.status}>{item.status}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  )
}
