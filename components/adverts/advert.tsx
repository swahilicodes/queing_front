import { useState, useEffect } from 'react';
import styles from './advert.module.scss'
import cx from 'classnames'

const AdvertScroller = (adverts:any) => {
  const [currentAdvertIndex, setCurrentAdvertIndex] = useState(0);

  useEffect(() => {
        const timeout = setTimeout(() => {
          setCurrentAdvertIndex((prevIndex) => (prevIndex + 1) % adverts.adverts.length);
        }, 20000);
      //const interval = setInterval(scrollAdverts, 20000);
      return () => clearInterval(timeout);
  }, [currentAdvertIndex]);


  return (
    <div className={styles.adverta}>
      {/* <div className={styles.advert}>{adverts[currentAdvertIndex]}</div> */}
      {
        adverts.adverts.length>0
        // ? <div className={styles.advert}>{adverts[currentAdvertIndex].description}</div>
        ? <div className={styles.adverts}>
          {
            adverts.adverts.map((item:any,index:number)=> (
              <div className={cx(styles.advert,index===currentAdvertIndex && styles.active)} key={index}>{item.description}</div>
            ))
          }
        </div>
        : <div className={styles.advert}>Karibu Hospitali ya Taifa Muhimbili Mloganzila</div>
      } 
    </div>
  );
};

export default AdvertScroller;
