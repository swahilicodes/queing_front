import React, { useState } from 'react'
import styles from './queue_list.module.scss'
import useFetchData from '@/custom_hooks/fetch'
import { FaMicrophoneAlt } from 'react-icons/fa'
import { MdOutlineEdit } from 'react-icons/md'
import cx from 'classnames'

export default function QueueList() {
  const {data,loading,error} = useFetchData("http://localhost:5000/tickets/getTickets")
  const [namba, setNumber] = useState(0)
  const [talking, setTalking] = useState(false)

  const handleSpeak = (namba:any) => {
    setTalking(true)
    setNumber(namba)
    const text = `mteja mwenye namba ${namba} nenda kwenye derisha namba tatu`
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
        {
            loading
            ? <div className={styles.loader}>loading...</div>
            : <div className={styles.wrap}>
                {
                    data.length<1
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
                            data.map((item:any,index:number)=> (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.ticket_no}</td>
                                        <td>{item.category}</td>
                                        <td>{item.status}</td>
                                        <td className={styles.action}>
                                            <div className={cx(styles.icon_wrap,namba===item.ticket_no && styles.active)} onClick={()=>handleSpeak(item.ticket_no)}><FaMicrophoneAlt className={styles.action_icon}/></div>
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
