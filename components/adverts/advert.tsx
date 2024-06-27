import { useState, useEffect } from 'react';
import styles from './advert.module.scss'
import cx from 'classnames'

const AdvertScroller = () => {
  const [currentAdvertIndex, setCurrentAdvertIndex] = useState(0);
  const adverts = ["hello there this is mloganzila","how are you doing", "come and see"]

  useEffect(() => {
    const scrollAdverts = () => {
      const timeout = setTimeout(() => {
        setCurrentAdvertIndex((prevIndex) => (prevIndex + 1) % adverts.length);
      }, 3000);

      return () => clearTimeout(timeout);
    };
    const interval = setInterval(scrollAdverts, 3000);
    return () => clearInterval(interval);
  }, [adverts]);

  return (
    <div className={styles.adverta}>
      <div className={styles.advert}>{adverts[currentAdvertIndex]}</div>
      {/* {adverts.map((advert:any, index:number) => (
        <div
          key={index}
          className={cx(styles.advert,index===currentAdvertIndex && styles.active)}
        >
          <p>{advert}</p>
        </div>
      ))} */}
    </div>
  );
};

export default AdvertScroller;
