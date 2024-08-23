import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from './meds.module.scss'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import isFull from '@/store/atoms/isFull'
import { GiSpeaker } from 'react-icons/gi'
import currentUserState from '@/store/atoms/currentUser'
import cx from 'classnames'
import { SlRefresh } from 'react-icons/sl'
import { io } from 'socket.io-client'
import Ticket_Category_Length from '@/components/ticket_category_length/ticket_category_length'
import { IoArrowRedoOutline } from 'react-icons/io5'

export default function MedicalRecords() {
  const [tickets, setTickets] = useState<any>([])
  const [page,setPage] = useState(1)
  const [pagesize,setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false)
  const router = useRouter()
  const [status, setStatus] = useState("waiting")
  const full = useRecoilValue(isFull)
  const [namba, setNumber] = useState(0)
  const [talking, setTalking] = useState(false)
  const currentUser:any = useRecoilValue(currentUserState)
  const socket = io('http://localhost:5000');
  const [refresh, setRefresh] = useState(false)
  const [edLoading,setEdLoading] = useState(false)
  const [specialIndex, setSpecialIndex] = useState(0)
  const [disable, setDisable] = useState("normal")

  useEffect(()=> {
    getTicks()
  },[status,disable])

  const getTicks  = () => {
    setFetchLoading(true)
    axios.get("http://localhost:5000/tickets/getMedsTickets",{params: {page,pagesize,status,disable}}).then((data:any)=> {
        setTickets(data.data.data)
        setFetchLoading(false)
        setTotalItems(data.data.totalItems)
    }).catch((error:any)=> {
        setFetchLoading(false)
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            alert(error.message);
        }
    })
 }

 const setDisability = (index:number,disability:string) => {
    setSpecialIndex(index)
    setDisable(disability)
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

  const reloda = () => {
    setRefresh(true)
    setInterval(()=> {
      setRefresh(false)
      router.reload()
    },2000)
  }
  const prepare = (id:string,status:string) => {
    editTicket(id,status)
  }

  const editTicket = (id:string,status:string) => {
    setEdLoading(true)
    axios.put(`http://localhost:5000/tickets/edit_ticket/${id}`,{status,disable}).then((data:any)=> {
      socket.emit("data",{data:data.data,route:"tickets"})
      setInterval(()=> {
        setEdLoading(false)
        router.reload()
      },3000)
    }).catch((error)=> {
      setEdLoading(false)
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
    <div className={styles.meds}>
        <div className={styles.meds_top}>
            <div className={styles.left}>{router.pathname}</div>
            <div className={styles.right}>
            <div className={styles.special}>
                <div className={cx(styles.one,specialIndex===1 && styles.active)} onClick={()=> setDisability(1,"normal")}>Normal</div>
                <div className={cx(styles.one,specialIndex===2 && styles.active)} onClick={()=> setDisability(2,"disabled")}>Special</div>
            </div>
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
        </div>
        {
            fetchLoading
            ? <div className={styles.loader}>loading...</div>
            : <div className={styles.wrap}>
                {
                    tickets.length<1
                    ? <div className={styles.message}>
                      <div className={styles.image}>
                        <img src="/nodata.svg" alt="" />
                      </div>
                      <p>there are no people on the queue</p>
                    </div>
                    : <div className={styles.list_queue_list}>
                        <div className={styles.list_wrap}>
                        <div className={cx(styles.saving,full && styles.full)}>
                          <div className={styles.saving_wrap}>
                          <div className={styles.save_full}>
                            <h4>Serving Now</h4>
                            <h1>{tickets[0].ticket_no}</h1>
                          </div>
                          <div className={styles.call} onClick={()=>handleSpeak(tickets[0].ticket_no)}>
                            <GiSpeaker size={150} className={cx(styles.click_icon,talking && styles.active)}/>
                          </div>
                          <div className={styles.two_other}>
                            <div className={styles.item} onClick={()=> prepare(tickets[0].id,"pending")}>Pend</div>
                            <div className={styles.item_red} onClick={()=> prepare(tickets[0].id,"cancelled")}>Cancel</div>
                          </div>
                          <div className={styles.finish} onClick={()=> prepare(tickets[0].id,"done")}>Finish</div>
                          <div className={styles.reload} onClick={()=> reloda()}>{refresh?<SlRefresh className={styles.icon}/>:"Refresh"}</div>
                          </div>
                        </div>
                        <table className={cx(styles.table,full && styles.full)}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ticket</th>
                                    <th>disability</th>
                                    <th>phone</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                            tickets.map((item:any,index:number)=> (
                                    <tr key={index} className={cx(index%2===0 && styles.even)}>
                                        <td>{item.id}</td>
                                        <td>{item.ticket_no}</td>
                                        <td>{item.disability}</td>
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
        {/* {
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
        } */}
    </div>
  )
}
