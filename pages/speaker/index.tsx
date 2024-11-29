import useFetchData from '@/custom_hooks/fetch'
import useCreateItem from '@/custom_hooks/useCreateItem'
import React, { useEffect, useState } from 'react'
import styles from './speaker.module.scss'
import axios from 'axios'
import cx from 'classnames'
import SequentialAudio from '@/components/audio_player/sequential/sequential'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import isSpeakerState from '@/store/atoms/isSpeaker'
import { CiMicrophoneOff, CiMicrophoneOn } from 'react-icons/ci'
import GptPlayer from '@/components/audio_player/gpt/gpt'

function Speaker() {
 const {createItem,loading} = useCreateItem()
 const [plays, setPlays] = useState([])
 const [isLoading,setLoading] = useState(false)
 const [isSpeaker, setSpeaker] = useRecoilState(isSpeakerState)
 const router = useRouter()
 const [fields, setFields] = useState({
    station: ""
 })

 useEffect(()=> {
    stationa()
    if(fields.station.trim() !== ""){
        getPlays()
        setInterval(()=> {
            getPlays()
        },2000)
    }
    // setInterval(()=> {
    //     router.reload()
    // },60000)
 },[fields.station])

 const stationa = () => {
    const station = localStorage.getItem('station')
    if(station){
        setFields({...fields,station: station}) 
    }  
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

 const getPlays = () => {
    axios.get("http://localhost:5000/speaker/get_speakers",{params: {station: fields.station}}).then((data)=> {
        setPlays(data.data)
        setPlays((plays) => plays.map((item)=> item))
    }).catch((error)=> {
        setLoading(false)
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            alert(error.message);
        }
    })
 }
  return (
    <div className={styles.speaker}>
        <div className={styles.enable} onClick={()=> setSpeaker(!isSpeaker)}>
            {
                isSpeaker
                ? <CiMicrophoneOff className={styles.icon} size={40}/>
                : <CiMicrophoneOn className={styles.icon} size={40}/>
            }
        </div>
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
        <div className={styles.items}>
            {
                plays.length <1 
                ? <div className={styles.message}>
                    No Plays
                </div>
                : <table>
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
                                <td><GptPlayer token={Number(removeLeadingZeros(item.ticket_no))} counter={Number(removeLeadingZeros(item.counter))} stage='meds' isPlaying={item.talking===true?true:false}/></td>
                                {/* <td>{item.talking===true?<GptPlayer token={Number(removeLeadingZeros(item.ticket_no))} counter={Number(removeLeadingZeros(item.counter))} stage='meds' isPlaying={item.talking===true?true:false}/>:"False"}</td>  */}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            }
        </div>
        <button onClick={()=> createItem("013","meds","m02","http://localhost:5000/speaker/create_speaker","1")}>{loading?"loading..":"Create Speaker"}</button>
    </div>
  )
}

export default Speaker