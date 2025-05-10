// 'use client'
// import React, { useEffect, useRef, useState } from 'react'
// import styles from './lazy.module.scss'

// interface video{
//     video: string
// }

// function LazyVideo({video}:video) {
// const wrapperRef = useRef<HTMLDivElement>(null);
// const [visible, setVisible] = useState(false);
// const [muted, setMuted] = useState(true)

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           setTimeout(()=> {
//             setMuted(false)
//           },5000)
//         }
//       },
//       { threshold: 0.1 }
//     );
//     if (wrapperRef.current) observer.observe(wrapperRef.current);
//     return () => observer.disconnect();
//   }, []);
//   return (
//     <div className={styles.lazy}>
//        <div className={styles.wrapper} ref={wrapperRef}>
//        {visible && (
//         <video autoPlay loop muted={muted}>
//           <source src={video} type="video/mp4" />
//         </video>
//       )}
//        </div>
//     </div>
//   )
// }

// export default LazyVideo


'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './lazy.module.scss'

interface VideoProps {
  video: string;
}

function LazyVideo({ video }: VideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => {
            if (videoRef.current) {
              //videoRef.current.muted = false;
            }
          }, 5000);
        }
      },
      { threshold: 0.1 }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.lazy}>
      <div className={styles.wrapper} ref={wrapperRef}>
        {visible && (
          <video ref={videoRef} autoPlay loop muted>
            <source src={video} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}

export default LazyVideo;
