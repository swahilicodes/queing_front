import React, { useEffect, useState } from 'react'
import styles from './queue_list.module.scss'
import useFetchData from '@/custom_hooks/fetch'
import { FaMicrophoneAlt } from 'react-icons/fa'
import { MdOutlineEdit } from 'react-icons/md'
import cx from 'classnames'
import { PiSpeakerHighDuotone } from 'react-icons/pi'
import { useRecoilState, useRecoilValue } from 'recoil'
import currentUserState from '@/store/atoms/currentUser'
import axios from 'axios'

export default function QueueList() {
  //const {data,loading,error} = useFetchData("http://localhost:5000/tickets/getTickets")
  //const {data,loading,error} = useFetchData("http://localhost:5000/tickets/getCatTickets")
  const [namba, setNumber] = useState(0)
  const [talking, setTalking] = useState(false)
  const currentUser:any = useRecoilValue(currentUserState)
  const [page,setPage] = useState(1)
  const [pagesize,setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0);
  const [tickets,setTickets] = useState([])
  const [loading,setLoading] = useState(false)

  useEffect(()=> {
    getTickets()
  },[])

  const getTickets = () => {
    console.log('current user ',currentUser)
    setLoading(true)
    axios.get("http://localhost:5000/tickets/getCatTickets",{params: {page,pagesize,category:currentUser.service??"Radiology"}}).then((data)=> {
      setTickets(data.data.data)
      // console.log(data.data.data)
      setLoading(false)
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

  const handleSpeak = (namba:any) => {
    setTalking(true)
    setNumber(namba)
    const text = `mteja mwenye namba ${namba} nenda kwenye derisha namba ${currentUser.counter}`
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;

      // Cancel any current speech in progress
      synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find the Swahili voice
      const voices = synthesis.getVoices();
      const swahiliFemaleVoice = voices.find((voice:any) => voice.lang === 'sw' && voice.gender === 'female');

      if (swahiliFemaleVoice) {
        utterance.voice = swahiliFemaleVoice;
      } else {
        console.warn('Swahili female voice not found.');
      }

      synthesis.speak(utterance);
      setInterval(()=> {
        setTalking(false)
      },5000)
    } else {
      console.error('Speech synthesis not supported.');
    }
  };
  return (
    <div className={styles.queue_list}>
      <div className={styles.top}>
        <div className={styles.side}>Tickets</div>
        <div className={styles.side}>({tickets.length})</div>
      </div>
        {
            loading
            ? <div className={styles.loader}>loading...</div>
            : <div className={styles.wrap}>
                {
                    tickets.length<1
                    ? <div className={styles.message}>there are no people on the queue</div>
                    : <div className={styles.list}>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>TICKET</th>
                                    <th>SERVICE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                            tickets.map((item:any,index:number)=> (
                                    <tr key={index} className={cx(index%2===0 && styles.even)}>
                                        <td>{item.id}</td>
                                        <td>{item.ticket_no}</td>
                                        <td>{item.category}</td>
                                        <td>{item.status}</td>
                                        <td className={styles.action}>
                                            {
                                              index===0 && (<div className={cx(styles.icon_wrap,namba===item.ticket_no && styles.active)} onClick={()=>handleSpeak(item.ticket_no)}><PiSpeakerHighDuotone className={styles.action_icon}/></div>)
                                            }
                                            <div className={cx(styles.icon_wrap,namba===item.ticket_no  && styles.active)}><MdOutlineEdit className={styles.action_icon}/></div>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        }
    </div>
  )
}
