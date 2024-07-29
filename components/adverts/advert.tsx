import { useState, useEffect } from 'react';
import styles from './advert.module.scss'
import cx from 'classnames'
import axios from 'axios';

const AdvertScroller = () => {
  const [currentAdvertIndex, setCurrentAdvertIndex] = useState(0);
  const [adverts,setAdverts] = useState<any>([])
  //const adverts = ["hello there this is mloganzila how are you doing how are you doing how are you doing ","how are you doinghello there this is mloganzila hello there this is mloganzila hello there this is mloganzila", "come and see hello there this is mloganzila hello there this is mloganzila hello there this is mloganzila hello there this is mloganzila"]

  useEffect(() => {
    getAdverts()
    const scrollAdverts = () => {
      const timeout = setTimeout(() => {
        setCurrentAdvertIndex((prevIndex) => (prevIndex + 1) % adverts.length);
      }, 20000);

      return () => clearTimeout(timeout);
    };
    const interval = setInterval(scrollAdverts, 20000);
    return () => clearInterval(interval);
  }, [adverts]);

  const getAdverts = () => {
    axios.get('http://localhost:5000/adverts/get_all_adverts').then((data)=> {
      setAdverts(data.data)
    }).catch((error)=> {
      alert(error)
    })
  }

  return (
    <div className={styles.adverta}>
      {
        adverts.length>0
        // ? <div className={styles.advert}>{adverts[currentAdvertIndex].description}</div>
        ? <div className={styles.adverts}>
          {
            adverts.map((item:any,index:number)=> (
              <div className={cx(styles.advert,index===currentAdvertIndex && styles.active)}>{item.description}</div>
            ))
          }
        </div>
        : <div className={styles.advert}>Karibu Hospitali ya Taifa Muhimbili Mloganzila</div>
      }
    </div>
  );
};

export default AdvertScroller;
