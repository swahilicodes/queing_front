import messageState from '@/store/atoms/message'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import styles from './player.module.scss'
import GptPlayer from '@/components/audio_player/gpt/gpt'
import cx from 'classnames'

function Player() {
 const [plays,setPlays] = useState([])
 const [isLoading,setLoading] = useState(false)
 const setMessage = useSetRecoilState(messageState)
 const [currentPlaying, setCurrentPlaying] = useState(0)
 const [fields, setFields] = useState({
     station: ""
  })

 useEffect(()=> {
    getPlays()
    setInterval(()=> {
        getPlays()
    },2000)
 },[currentPlaying])

 const getPlays = () => {
    axios.get("http://192.168.30.246:5000/speaker/get_speakers",{params: {station: "M02"}}).then((data)=> {
        const sortedTickets = data.data.sort((a:any, b:any) => a.id - b.id);
        setPlays(sortedTickets)
        if(data.data.length>0){
          setCurrentPlaying(sortedTickets[0].id)
        }
    }).catch((error)=> {
        setLoading(false)
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
            setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
    })
 }

 function removeLeadingZeros(input: string): string {
  return input.replace(/^0+/, '') || '0';
}

const handleStation = (value:string) => {
  const station = localStorage.getItem('station')
  setFields({...fields,station: value})
  if(station){
      localStorage.removeItem('station')
      localStorage.setItem('station',value)
  }else{
      localStorage.setItem('station',value)
  }
}
  return (
    <div className={styles.player}>
      <div className={styles.speaker_top}>
            <div className={styles.left}>
                <div className={styles.item}>
                    <label>Station</label>
                    <select
                    value={fields.station}
                    onChange={e => handleStation(e.target.value)}
                    >
                        <option value="" disabled selected>--Select Station--</option>
                        <option value="m01">M01</option>
                        <option value="m02">M02</option>
                        <option value="m03">M03</option>
                    </select>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.item}>{plays.length}</div>
            </div>
        </div>
      {
        plays.length>0
        ?<table>
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
            {
                plays.map((item:any,index:number)=> (
                    <tr key={index} className={cx(index%2===0 && styles.even)}>
                        <td>{item.ticket_no}</td>
                        <td>{item.stage}</td>
                        <td>{item.counter}</td>
                        <td>{item.station}</td>
                        <td><GptPlayer token={Number(removeLeadingZeros(item.ticket_no))} counter={Number(removeLeadingZeros(item.counter))} stage={item.stage} isPlaying={currentPlaying===item.id?true:false} id={item.id}/></td>
                    </tr>
                ))
            }
        </tbody>
    </table>
        // ? <div className={styles.plays}>
        //   {
        //     plays.map((item:any,index:number)=> (
        //       <div className={styles.play_wrapper}>
        //         <div className={styles.play_item}>
        //         <GptPlayer token={Number(removeLeadingZeros(item.ticket_no))} counter={Number(removeLeadingZeros(item.counter))} stage={item.stage} isPlaying={currentPlaying===item.id?true:false} id={item.id}/>
        //       </div>
        //       </div>
        //     ))
        //   }
        // </div>
        : <div className={styles.message}>
          <h1>There are no Plays</h1>
        </div>
      }
    </div>
  )
}

export default Player
