import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import cx from 'classnames';

interface Ticket {
  ticket_no: string;
}

interface CurrentServingProps {
  savs: Ticket[];
}

function UpNext({ savs }: CurrentServingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!savs || savs.length === 0) {
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % savs.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [savs.length]);

  if (!savs || savs.length === 0) {
    return null
  }
  function incrementAndPad(numStr: string): string {
  const originalLength = numStr.length;
  const incremented = parseInt(numStr, 10) + 1;
  return String(incremented).padStart(originalLength, '0');
}



  return (
    <div className={styles.current_serving}>
      {savs.map((item: any, index) => (
        <div
          key={item.ticket_no}
          className={cx(styles.namba, { [styles.active]: currentIndex === index })}
        >
          <div className={cx(styles.card, { [styles.flip]: currentIndex === index })}>
            <p>{incrementAndPad(item.ticket.ticket_no)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UpNext;