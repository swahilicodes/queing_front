// import React, { useEffect, useState } from 'react';
// import styles from './styles.module.scss';
// import cx from 'classnames';

// interface Ticket {
//   ticket_no: string;
// }

// interface CurrentServingProps {
//   savs: Ticket[];
// }

// function CurrentServing({ savs }: CurrentServingProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     // Only set up the interval if savs is not empty
//     if (!savs || savs.length === 0) {
//       setCurrentIndex(0); // Reset index if savs is empty
//       return;
//     }

//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % savs.length);
//     }, 4000); // 4 seconds

//     return () => clearInterval(interval); // Clean up on unmount
//   }, [savs.length]); // Depend on savs.length instead of savs

//   // Handle empty or undefined savs
//   if (!savs || savs.length === 0) {
//     return <div className={styles.current_serving}>No tickets available</div>;
//   }

//   return (
//     <div className={styles.current_serving}>
//       {savs.map((item:any, index) => (
//         <div
//           key={item.ticket_no} // Use a unique key, e.g., ticket_no
//           className={cx(styles.namba, { [styles.active]: currentIndex === index })}
//         >
//           <div className={styles.card}>
//             <p>{item.ticket.ticket_no}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CurrentServing;

import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import cx from 'classnames';

interface Ticket {
  ticket_no: string;
}

interface CurrentServingProps {
  savs: Ticket[];
}

function CurrentServing({ savs }: CurrentServingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!savs || savs.length === 0) {
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % savs.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [savs.length]);

  if (!savs || savs.length === 0) {
    return null
  }

  return (
    <div className={styles.current_serving}>
      {savs.map((item: any, index) => (
        <div
          key={item.ticket_no}
          className={cx(styles.namba, { [styles.active]: currentIndex === index })}
        >
          <div className={cx(styles.card, { [styles.flip]: currentIndex === index })}>
            <p>{item.ticket.ticket_no}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CurrentServing;