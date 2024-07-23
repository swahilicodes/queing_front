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
import { GiSpeaker } from 'react-icons/gi'
import isFull from '@/store/atoms/isFull'
import { IoArrowRedoOutline } from 'react-icons/io5'
import Ticket_Category_Length from '@/components/ticket_category_length/ticket_category_length'

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
  const [status, setStatus] = useState("waiting")
  const full = useRecoilValue(isFull)

  useEffect(() => {
    getTickets()
  }, [status]);

  const getTickets = () => {
    console.log('current user ',currentUser)
    setLoading(true)
    axios.get("http://localhost:5000/tickets/getCatTickets",{params: {page,pagesize,category:currentUser.service??"Radiology",status}}).then((data)=> {
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
      socket.emit("data",{data:data.data,route:"tickets"})
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

      synthesis.speak(utterance)
      setInterval(()=> {
        setTalking(false)
      },9000)
    } else {
      console.error('Speech synthesis not supported.');
    }
  };
  return (
    <div className={styles.queue_list}>
      <div className={styles.top}>
        <div className={styles.side}>{currentUser.name}/{currentUser.counter}</div>
        {/* <div className={styles.side}>({currentUser.counter})</div> */}
        <div className={styles.side}>
          <label>Status:</label>
          <select onChange={e => setStatus(e.target.value)} value={status}>
            <option value="waiting">waiting</option>
            <option value="done">done</option>
            <option value="cancelled">cancelled</option>
            <option value="pending">pending</option>
          </select>
        </div>
      </div>
        {
            loading
            ? <div className={styles.loader}>loading...</div>
            : <div className={styles.wrap}>
                {
                    tickets.length<1
                    ? <div className={styles.message}>there are no people on the queue</div>
                    : <div className={styles.list_queue_list}>
                        <div className={styles.list_wrap}>
                        <div className={cx(styles.saving,full && styles.full)}>
                          <div className={styles.saving_wrap}>
                          <div className={styles.save_full}>
                            <h4>Saving Now</h4>
                            <h1>{tickets[0].ticket_no}</h1>
                          </div>
                          <div className={styles.call} onClick={()=>handleSpeak(tickets[0].ticket_no)}>
                            <GiSpeaker size={150} className={cx(styles.click_icon,talking && styles.active)}/>
                          </div>
                          <div className={styles.two_other}>
                            <div className={styles.item}>Pending</div>
                            <div className={styles.item_red} onClick={()=> editTicket(tickets[0].id)}>Cancel</div>
                          </div>
                          <div className={styles.finish}>Finish</div>
                          </div>
                        </div>
                        <table className={cx(styles.table,full && styles.full)}>
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
        {
          tickets.length > 0 && (<div className={styles.bottom_desc}>
            <div className={styles.top}>
              <div className={styles.item}>
                <p>On Queue: <span> <Ticket_Category_Length category={currentUser.service} status='waiting'/> </span> </p>
              </div>
              <div className={styles.item}>
                <p>Attended: <span><Ticket_Category_Length category={currentUser.service} status='done'/></span> </p>
              </div>
              <div className={styles.item}>
                <p>Pending: <span><Ticket_Category_Length category={currentUser.service} status='pending'/></span> </p>
              </div>
              <div className={styles.item}>
                <p>Cancelled: <span><Ticket_Category_Length category={currentUser.service} status='cancelled'/></span> </p>
              </div>
              <div className={styles.item_out}>
                <IoArrowRedoOutline className={styles.icon}/>
              </div>
            </div>
          </div>)
        }
    </div>
  )
}
