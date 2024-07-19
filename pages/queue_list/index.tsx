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
import { useRouter } from 'next/router' 
import io from 'socket.io-client';

export default function QueueList() {
  //const {data,loading,error} = useFetchData("http://localhost:5000/tickets/getTickets")
  //const {data,loading,error} = useFetchData("http://localhost:5000/tickets/getCatTickets")
  const [namba, setNumber] = useState(0)
  const [talking, setTalking] = useState(false)
  const currentUser:any = useRecoilValue(currentUserState)
  const [page,setPage] = useState(1)
  const [pagesize,setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState<any>(0);
  const [tickets,setTickets] = useState<any>([])
  const [loading,setLoading] = useState(false)
  const router = useRouter()
  const socket = io('http://localhost:5000');

  useEffect(() => {
    getTickets()
  }, []);

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

  const editTicket = (id:string) => {
    axios.put(`http://localhost:5000/tickets/edit_ticket/${id}`).then((data:any)=> {
      socket.emit("data",data.data.phone)
      //console.log(data)
      //router.reload()
    }).catch((error)=> {
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
        <div className={styles.side}>{currentUser.name},Queue List</div>
        <div className={styles.side}>({currentUser.counter})</div>
      </div>
        {
            loading
            ? <div className={styles.loader}>loading...</div>
            : <div className={styles.wrap}>
                {
                    tickets.length<1
                    ? <div className={styles.message}>there are no people on the queue</div>
                    : <div className={styles.list}>
                        <div className={styles.list_wrap}>
                        <div className={styles.saving}>
                          <div className={styles.save_full}>
                            <h4>Saving Now</h4>
                            <h1>{tickets[0].ticket_no}</h1>
                          </div>
                          <div className={styles.call} onClick={()=>handleSpeak(tickets[0].ticket_no)}>Call</div>
                          <div className={styles.two_other}>
                            <div className={styles.item}>Pending</div>
                            <div className={styles.item_red} onClick={()=> editTicket(tickets[0].id)}>Finish</div>
                          </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ticket</th>
                                    <th>clinic</th>
                                    <th>phone</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                            tickets.map((item:any,index:number)=> (
                                    <tr key={index} className={cx(index%2===0 && styles.even)}>
                                        <td>{item.id}</td>
                                        <td>{item.ticket_no}</td>
                                        <td>{item.category}</td>
                                        <td>{item.phone}</td>
                                        {/* <td className={styles.action}>
                                            {
                                              index===0 && (<div className={cx(styles.icon_wrap,namba===item.ticket_no && styles.active)} onClick={()=>handleSpeak(item.ticket_no)}><PiSpeakerHighDuotone className={styles.action_icon}/></div>)
                                            }
                                            <div className={cx(styles.icon_wrap,namba===item.ticket_no  && styles.active)} onClick={()=> editTicket(item.id)}><MdOutlineEdit className={styles.action_icon}/></div>
                                        </td> */}
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                        </div>
                        <div className={styles.list_botoms}>
                          <div className={styles.list_botom}>On Queue: 1</div>
                          <div className={styles.list_botom}>Attended: 56</div>
                          <div className={styles.list_botom}>Pending: 0</div>
                          <div className={styles.list_botom}>Remaining: 50</div>
                        </div>
                    </div>
                }
            </div>
        }
    </div>
  )
}
