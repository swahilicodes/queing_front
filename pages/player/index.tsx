// import messageState from '@/store/atoms/message'
// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { useSetRecoilState } from 'recoil'
// import styles from './player.module.scss'
// import GptPlayer from '@/components/audio_player/gpt/gpt'
// import cx from 'classnames'

// function Player() {
//  const [plays,setPlays] = useState([])
//  const [isLoading,setLoading] = useState(false)
//  const setMessage = useSetRecoilState(messageState)
//  const [currentPlaying, setCurrentPlaying] = useState(0)
//  const [fields, setFields] = useState({
//      station: "",
//      floor: ''
//   })

//  useEffect(()=> {
//     getPlays()
//     const playInterval = setInterval(()=> {
//         getPlays()
//     },2000)
//     return () => {
//       clearInterval(playInterval);
//     };
//  },[currentPlaying])

//  useEffect(()=> {
//      if(typeof window !== undefined){
//        console.log('floor is ',localStorage.getItem('speaker_floor')!)
//        setFields({...fields,floor: localStorage.getItem('speaker_floor')!})
//      }
//    },[fields.floor])

//  const getPlays = () => {
//     axios.get("http://192.168.30.246:5005/speaker/get_speakers",{params: {floor: fields.floor}}).then((data)=> {
//         const sortedTickets = data.data.sort((a:any, b:any) => a.id - b.id);
//         setPlays(sortedTickets)
//         if(data.data.length>0){
//           setCurrentPlaying(sortedTickets[0].id)
//         }
//     }).catch((error)=> {
//         setLoading(false)
//         if (error.response && error.response.status === 400) {
//             console.log(`there is an error ${error.message}`)
//             setMessage({...onmessage,title:error.response.data.error,category: "error"})
//             setTimeout(()=> {
//                 setMessage({...onmessage,title:"",category: ""})  
//             },5000)
//         } else {
//             setMessage({...onmessage,title:error.message,category: "error"})
//             setTimeout(()=> {
//                 setMessage({...onmessage,title:"",category: ""})  
//             },5000)
//         }
//     })
//  }

//  function removeLeadingZeros(input: string): string {
//   return input.replace(/^0+/, '') || '0';
// }

// const handleStation = (value:string) => {
//   const station = localStorage.getItem('station')
//   setFields({...fields,station: value})
//   if(station){
//       localStorage.removeItem('station')
//       localStorage.setItem('station',value)
//   }else{
//       localStorage.setItem('station',value)
//   }
// }

// const handleFloor = (value:string) => {
//   const floor = localStorage.getItem('speaker_floor')
//   setFields({...fields,floor: value})
//   if(floor){
//       localStorage.removeItem('speaker_floor')
//       localStorage.setItem('speaker_floor',value)
//       location.reload()
//   }else{
//       localStorage.setItem('speaker_floor',value)
//       location.reload()
//   }
// }
//   return (
//     <div className={styles.player}>
//       <div className={styles.speaker_top}>
//             <div className={styles.left}>
//                 {/* <div className={styles.item}>
//                     <label>Station</label>
//                     <select
//                     value={fields.station}
//                     onChange={e => handleStation(e.target.value)}
//                     >
//                         <option value="" disabled selected>--Select Station--</option>
//                         <option value="m01">M01</option>
//                         <option value="m02">M02</option>
//                         <option value="m03">M03</option>
//                     </select>
//                 </div> */}
//                 <div className={styles.item}>
//                     <label>Floor</label>
//                     <select
//                     value={fields.floor}
//                     onChange={e => handleFloor(e.target.value)}
//                     >
//                         <option value="" disabled selected>--Select floor--</option>
//                         <option value="ground">Ground</option>
//                         <option value="first">First</option>
//                     </select>
//                 </div>
//             </div>
//             <div className={styles.right}>
//                 <div className={styles.item}>{plays.length}</div>
//             </div>
//         </div>
//       {
//         plays.length>0
//         ?<table>
//         <thead>
//             <tr>
//                 <th>Token</th>
//                 <th>Stage</th>
//                 <th>Counter</th>
//                 <th>Station</th>
//                 <th>Talking</th>
//             </tr>
//         </thead>
//         <tbody>
//             {
//                 plays.map((item:any,index:number)=> (
//                     <tr key={index} className={cx(index%2===0 && styles.even)}>
//                         <td>{item.ticket_no}</td>
//                         <td>{item.stage}</td>
//                         <td>{item.counter}</td>
//                         <td>{item.station}</td>
//                         <td><GptPlayer token={Number(removeLeadingZeros(item.ticket_no))} counter={Number(removeLeadingZeros(item.counter))} stage={item.stage} isPlaying={currentPlaying===item.id?true:false} id={item.id}/></td>
//                     </tr>
//                 ))
//             }
//         </tbody>
//     </table>
//         : <div className={styles.message}>
//           <h1>There are no Plays</h1>
//         </div>
//       }
//     </div>
//   )
// }

// export default Player


import messageState from '@/store/atoms/message'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import styles from './player.module.scss'
import GptPlayer from '@/components/audio_player/gpt/gpt'
import cx from 'classnames'

function Player() {
  const [plays, setPlays] = useState<any[]>([])
  const [isLoading, setLoading] = useState(false)
  const setMessage = useSetRecoilState(messageState)
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null)

  const [fields, setFields] = useState({
    station: '',
    floor: ''
  })

  /* ---------------------------------------------
     1. Load floor from localStorage ONCE
  --------------------------------------------- */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFloor = localStorage.getItem('speaker_floor') || ''
      setFields(prev => ({ ...prev, floor: savedFloor }))
    }
  }, [])

  /* ---------------------------------------------
     2. Fetch plays ONLY when floor exists
  --------------------------------------------- */
  useEffect(() => {
    if (!fields.floor) return

    getPlays()

    const playInterval = setInterval(() => {
      getPlays()
    }, 2000)

    return () => clearInterval(playInterval)
  }, [fields.floor])

  /* ---------------------------------------------
     3. API call (safe)
  --------------------------------------------- */
  const getPlays = () => {
    if (!fields.floor) return

    setLoading(true)

    axios
      .get('http://192.168.30.246:5005/speaker/get_speakers', {
        params: { floor: fields.floor }
      })
      .then(res => {
        const sorted = res.data.sort((a: any, b: any) => a.id - b.id)
        setPlays(sorted)

        if (sorted.length > 0) {
          setCurrentPlaying(sorted[0].id)
        } else {
          setCurrentPlaying(null)
        }

        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setMessage({
          title: error?.response?.data?.error || error.message,
          category: 'error'
        })
        setTimeout(() => {
          setMessage({ title: '', category: '' })
        }, 5000)
      })
  }

  /* ---------------------------------------------
     Helpers
  --------------------------------------------- */
  function removeLeadingZeros(input: string): string {
    return input.replace(/^0+/, '') || '0'
  }

  const handleFloor = (value: string) => {
    localStorage.setItem('speaker_floor', value)
    setFields(prev => ({ ...prev, floor: value }))
  }

  return (
    <div className={styles.player}>
      <div className={styles.speaker_top}>
        <div className={styles.left}>
          <div className={styles.item}>
            <label>Floor</label>
            <select
              value={fields.floor}
              onChange={e => handleFloor(e.target.value)}
            >
              <option value="" disabled>
                --Select floor--
              </option>
              <option value="ground">Ground</option>
              <option value="first">First</option>
            </select>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.item}>{plays.length}</div>
        </div>
      </div>

      {plays.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Stage</th>
              <th>Counter</th>
              <th>Station</th>
              <th>Talking</th>
            </tr>
          </thead>
          <tbody>
            {plays.map((item: any, index: number) => (
              <tr key={item.id} className={cx(index % 2 === 0 && styles.even)}>
                <td>{item.ticket_no}</td>
                <td>{item.stage}</td>
                <td>{item.counter}</td>
                <td>{item.station}</td>
                <td>
                  <GptPlayer
                    token={Number(removeLeadingZeros(item.ticket_no))}
                    counter={Number(removeLeadingZeros(item.counter))}
                    stage={item.stage}
                    isPlaying={currentPlaying === item.id}
                    id={item.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.message}>
          <h1>{isLoading ? 'Loading...' : 'There are no Plays'}</h1>
        </div>
      )}
    </div>
  )
}

export default Player
