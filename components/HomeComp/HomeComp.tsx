import React, { useEffect, useRef, useState } from 'react'
import styles from './home_comp.module.scss'
import { MdZoomInMap } from 'react-icons/md';
import AdvertScroller from '../adverts/advert';
import useFetchData from '@/custom_hooks/fetch';

export default function HomeComp() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const {data:queue,loading,error} = useFetchData("http://localhost:5000/queues/getAll")

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
    <div className={styles.home_comp}>
        <div className={styles.top}>
            <div className={styles.item}>Foleni Muhimbili</div>
            <div className={styles.item}>
                <div className={styles.act}>Doctor</div>
                <div className={styles.act}>Nurse</div>
                <div className={styles.act} id="fullScreenButton" onClick={toggleFullScreen}><MdZoomInMap/></div>
            </div>
        </div>
        <div className={styles.body}>
            <div className={styles.left}></div>
            <div className={styles.right}>
                {
                    loading
                    ? <p>loading...</p>
                    : <div className={styles.items}>
                        {
                            queue.map((item:any,index:number)=> (
                                <div className={styles.item} key={index}>
                                    <div className={styles.ticket}>{item.ticket_no.toUpperCase()}</div>
                                    <div className={styles.name}>{item.name.toUpperCase()}</div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
        <div className={styles.adverts}><AdvertScroller/></div>
    </div>
  )
}
