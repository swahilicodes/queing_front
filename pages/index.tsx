import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { MdZoomInMap } from 'react-icons/md';
import useFetchData from '@/custom_hooks/fetch';
import CatTickets from '@/components/cat_tickets/cat_tickets';
import cx from 'classnames'
import AdvertScroller from '@/components/adverts/advert';

export default function Home() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const {data:queue,loading,error} = useFetchData("http://localhost:5000/tickets/getTickets")
    const date = new Date()

    useEffect(()=> {
      //console.log(queue)
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
            <th>
              <div className={styles.th_item}>
              {item.toUpperCase()}
              </div>
            </th>
          ))
        }
        </tr>
        </thead>
        <tbody>
          <tr>
            {
              Array.from(new Set(queue.map((item:any,index:number)=> item.category))).map((item:any,index:number)=> (
                <td className={cx(index%2===0 && styles.even)}> <CatTickets category={item}/> </td>
              ))
            }
          </tr>
        </tbody>
      </table>
    </div>
  }else{
    folen = <p>Nothing Here</p>
  }
  return (
    <div className={styles.index}>
      {folen}
      <div className={styles.color_expla}>
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
      </div>
      <div className={styles.ads}>
        <div className={styles.ad}> <AdvertScroller/> </div>
        <div className={styles.time}>
          MATANGAZO
          {/* <div className={styles.time_date}>{date.getDate()}/{date.getMonth()}/{date.getFullYear()}</div>
          <div className={styles.time_time}>{date.getHours().toString().padStart(2, '0')}<span>:</span>{date.getMinutes().toString().padStart(2, '0')}<span>:</span>{date.getSeconds().toString().padStart(2, '0')}</div> */}
        </div>
      </div>
    </div>
  )
}
