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
import Cubes from '@/components/loaders/cubes/cubes'
import { SlRefresh } from 'react-icons/sl'
import Patient_Category_Length from '@/components/patient_category_length/ticket_category_length'

export default function QueueList() {
  //const {data,loading,error} = useFetchData("http://localhost:5000/tickets/getTickets")
  //const {data,loading,error} = useFetchData("http://localhost:5000/tickets/getCatTickets")
  const [namba, setNumber] = useState(0)
  const [talking, setTalking] = useState(false)
  const [page,setPage] = useState(1)
  const [pagesize,setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState<any>(0);
  const [patients,setPatients] = useState<any>([])
  const [loading,setLoading] = useState(false)
  const router = useRouter()
  const socket = io('http://localhost:5000');
  const [status, setStatus] = useState("vitaling")
  const full = useRecoilValue(isFull)
  const [edLoading,setEdLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const limitedCats = ["Cardiology","RARDIOLOGY"] 
  const [currentUser,setCurrentUser] = useRecoilState<any>(currentUserState)
  const patList = [
    {
      id: 0,
      name: "mariam",
      clinic: "Mazoezi",
      mr_no: "M58-48-14",
      age: "57.03.10",
      sex: "female",
      reg_date: "06/08/2024",
      reg_time: "07:51:40",
      consult_time: "15:05:40",
      consult_date: "18/07/2024",
      doctor: "Marry Mariwa",
      consult_doctor: "Marry Mariwa",
    },
    {
      id: 1,
      name: "hawa",
      clinic: "Mazoezi",
      mr_no: "M57-48-14",
      age: "57.03.10",
      sex: "male",
      reg_date: "06/08/2024",
      reg_time: "12:51:40",
      consult_time: "15:05:40",
      consult_date: "18/07/2024",
      doctor: "Marry Mariwa",
      consult_doctor: "Marry Mariwa",
    }
  ]

  useEffect(() => {
    getTickets()
    // setInterval(()=> {
    //   getTickets()
    // },20000)
  }, [status]);

  const dateObject = (date:any,time:any) => {
    const dateObj = new Date(
      date.split('/')[2],     // Year
      date.split('/')[1] - 1, // Month (zero-based index)
      date.split('/')[0],     // Day
      time.split(':')[0],         // Hours
      time.split(':')[1],          // Minutes
      time.split(':')[2]          // seconds
    );
    return dateObj
  }

  const signOut = () => {
    localStorage.removeItem('token')
    setCurrentUser({})
    router.push('/login')
 }

  const fetchnfilter = (patientes:any) => {
    const now:any = new Date();
    const oneDay:any = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if(patientes.length===0){
      for (var i=0; i<patList.length; i++){
          const providedDate:any = dateObject(patList[i].reg_date,patList[i].reg_time);
          const currentDate:any = new Date();
          const differenceInMilliseconds = currentDate - providedDate;
          const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
          if(differenceInHours<24){
            if(limitedCats.includes(patList[i].clinic)){
              addPatient(patList[i].name,patList[i].clinic.toLowerCase(),patList[i].mr_no,patList[i].age,patList[i].sex,"vitaling",dateObject(patList[i].reg_date,patList[i].reg_time),dateObject(patList[i].consult_date,patList[i].consult_time),patList[i].doctor,patList[i].consult_doctor)
            }else{
              addPatient(patList[i].name,patList[i].clinic.toLowerCase(),patList[i].mr_no,patList[i].age,patList[i].sex,"waiting",dateObject(patList[i].reg_date,patList[i].reg_time),dateObject(patList[i].consult_date,patList[i].consult_time),patList[i].doctor,patList[i].consult_doctor)
            }
          }else{
            console.log('not less than 24')
          }
      }
    }else{
      for (var i=0; i<patList.length; i++){
        const providedDate:any = dateObject(patList[i].reg_date,patList[i].reg_time);
        const currentDate:any = new Date();
        const differenceInMilliseconds = currentDate - providedDate;
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
        if(differenceInHours<24){
          if(limitedCats.includes(patList[i].clinic)){
            console.log('limited category')
            addPatient(patList[i].name,patList[i].clinic.toLowerCase(),patList[i].mr_no,patList[i].age,patList[i].sex,"vitaling",dateObject(patList[i].reg_date,patList[i].reg_time),dateObject(patList[i].consult_date,patList[i].consult_time),patList[i].doctor,patList[i].consult_doctor)
          }else{
            console.log('unlimited category')
            addPatient(patList[i].name,patList[i].clinic.toLowerCase(),patList[i].mr_no,patList[i].age,patList[i].sex,"waiting",dateObject(patList[i].reg_date,patList[i].reg_time),dateObject(patList[i].consult_date,patList[i].consult_time),patList[i].doctor,patList[i].consult_doctor)
          }
        }else{
          console.log('not less than 24')
        }
    }
    }
  }

  const reloda = () => {
    setRefresh(true)
    setInterval(()=> {
      setRefresh(false)
      router.reload()
    },2000)
  }

  const getTickets = () => {
    const service:any = localStorage.getItem("user_service")?.toLocaleLowerCase()
    setLoading(true)
    axios.get("http://localhost:5000/patients/getVitalPatients",{params:{clinic:service,status:status}}).then((data)=> {
      setPatients(data.data.data)
      console.log(data.data.data)
      setLoading(false)
      // setTimeout(()=> {
      //   fetchnfilter(data.data)
      //   setLoading(false)
      // },2000)
    }).catch((error)=> {
      setLoading(false)
      if (error.response && error.response.status === 400) {
        console.log(`there is an error ${error.response.data.error}`)
        //alert(error.response.data.error);
    } else {
        console.log(`there is an error message ${error.message}`)
        //alert(error.message);
    }
    })
  }

  const editTicket = (id:string,status:string) => {
    setEdLoading(true)
    axios.put(`http://localhost:5000/patients/edit_patient/${id}`,{status}).then((data:any)=> {
      socket.emit("data",{data:data.data,route:"patients"})
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
  const addPatient = (name:string,clinic:string,mr_no:string,age:string,sex:string,status:string,reg_date: Date,consult_date:Date,doctor:string,consult_doctor:string) => {
    //setEdLoading(true)
    axios.post(`http://localhost:5000/patients/register_patient`,{name:name, clinic:clinic, mr_no:mr_no,age:age, sex:sex, status: status,reg_date:reg_date,consult_date:consult_date, doctor:doctor, consult_doctor:consult_doctor}).then((data:any)=> {
      socket.emit("data",{data:data.data,route:"tickets"})
      setInterval(()=> {
        //setEdLoading(false)
        router.reload()
      },3000)
    }).catch((error)=> {
      //setEdLoading(false)
      if (error.response && error.response.status === 400) {
        console.log(`there is an error ${error.message}`)
        alert(error.response.data.error);
    } else {
        console.log(`there is an error message ${error.message}`)
        alert(error.message);
    }
    })
  }

  const prepare = (id:string,status:string) => {
    editTicket(id,status)
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
        <div className={cx(styles.overlay,edLoading && styles.active)}>
          <div className={styles.conts}>
            <Cubes/>
          </div>
        </div>
      <div className={styles.top}>
        <div className={styles.side}>{currentUser.name}/{currentUser.counter}</div>
        {/* <div className={styles.side}>({currentUser.counter})</div> */}
        <div className={styles.side}>
          <label>Status:</label>
          <select onChange={e => setStatus(e.target.value)} value={status}>
            <option value="vitaling">waiting</option>
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
                    patients.length<1
                    ? <div className={styles.message}>
                      <div className={styles.image}>
                        <img src="/nodata.svg" alt="" />
                      </div>
                      <p>there are no patients on the queue</p>
                    </div>
                    : <div className={styles.list_queue_list}>
                        <div className={styles.list_wrap}>
                        <div className={cx(styles.saving,full && styles.full)}>
                          <div className={styles.saving_wrap}>
                          <div className={styles.save_full}>
                            <h4>Saving Now</h4>
                            <h1>{patients[0].mr_no}</h1>
                          </div>
                          <div className={styles.call} onClick={()=>handleSpeak(patients[0].mr_no)}>
                            <GiSpeaker size={150} className={cx(styles.click_icon,talking && styles.active)}/>
                          </div>
                          <div className={styles.two_other}>
                            <div className={styles.item} onClick={()=> prepare(patients[0].id,"pending")}>Pend</div>
                            <div className={styles.item_red} onClick={()=> prepare(patients[0].id,"cancelled")}>Cancel</div>
                          </div>
                          <div className={styles.finish} onClick={()=> prepare(patients[0].id,"waiting")}>Finish</div>
                          <div className={styles.reload} onClick={()=> reloda()}>{refresh?<SlRefresh className={styles.icon}/>:"Refresh"}</div>
                          </div>
                        </div>
                        <table className={cx(styles.table,full && styles.full)}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>mr no</th>
                                    <th>clinic</th>
                                    <th>age</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                            patients.map((item:any,index:number)=> (
                                    <tr key={index} className={cx(index%2===0 && styles.even)}>
                                        <td>{item.id}</td>
                                        <td>{item.mr_no}</td>
                                        <td>{item.clinic}</td>
                                        <td>{item.age}</td>
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
          patients.length > 0 && (<div className={styles.bottom_desc}>
            <div className={styles.top}>
              <div className={styles.item}>
                <p>On Queue: <span> <Patient_Category_Length category={currentUser.service} status='waiting'/> </span> </p>
              </div>
              <div className={styles.item}>
                <p>Attended: <span><Patient_Category_Length category={currentUser.service} status='done'/></span> </p>
              </div>
              <div className={styles.item}>
                <p>Pending: <span><Patient_Category_Length category={currentUser.service} status='pending'/></span> </p>
              </div>
              <div className={styles.item}>
                <p>Cancelled: <span><Patient_Category_Length category={currentUser.service} status='cancelled'/></span> </p>
              </div>
              <div className={styles.item_out} onClick={signOut}>
                <IoArrowRedoOutline className={styles.icon}/>
              </div>
            </div>
          </div>)
        }
    </div>
  )
}
