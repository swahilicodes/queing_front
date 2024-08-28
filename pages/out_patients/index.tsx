import React, { useEffect, useState } from 'react'
import styles from './out.module.scss'
import axios from 'axios';
import Cubes from '@/components/loaders/cubes/cubes';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import currentUserState from '@/store/atoms/currentUser';
import cx from 'classnames'
import { IoArrowRedoOutline, IoSearch } from 'react-icons/io5';
import { MdOutlineClear } from 'react-icons/md';
import isFull from '@/store/atoms/isFull';
import { GiSpeaker } from 'react-icons/gi';
import { SlRefresh } from 'react-icons/sl';
import Medicine_Category_Length from '@/components/meds_cat_length';

function OutPatients() {
const [patients, setPatients] = useState<any>([]);
const [clients, setClients] =  useState<any>([]);
const [tickets, setTickets] = useState<any>([])
const [page,setPage] = useState(1)
const [pagesize,setPageSize] = useState(10)
const [totalItems, setTotalItems] = useState(0);
const [fetchLoading, setFetchLoading] = useState(false)
const router = useRouter()
const [status, setStatus] = useState("waiting")
const [namba, setNumber] = useState(0)
const [talking, setTalking] = useState(false)
const currentUser:any = useRecoilValue(currentUserState)
const socket = io('http://localhost:5000');
const [refresh, setRefresh] = useState(false)
const [edLoading,setEdLoading] = useState(false)
const [specialIndex, setSpecialIndex] = useState(0)
const [disable, setDisable] = useState("normal")
const [search, setSearch] = useState(false)
const [ticket, setTicket] = useState('')
const [language, setLanguage] = useState<string>('sw-KE');
const full = useRecoilValue(isFull)

  useEffect(() => {
    getPatients()
    const checkPatients = () => {
        patients.map((patient:any) => {
          const regDateTime:Date = new Date(`${patient.regDate}T${patient.regTime}`);
          const now:Date = new Date();
          const timeDiff = now.getTime() - regDateTime.getTime();
          const hoursDiff = (now.getTime() - regDateTime.getTime()) / (1000 * 60 * 60);
    
          if (hoursDiff < 24) {
            if(clients.length>0){
              clients.map((item:any)=> {
                if(item.mr_no===patient.mrNumber){
                  console.log('patient exists')
                }else{
                  axios.post('http://localhost:5000/patients/register_patient',{name:patient.name,stage:"meds",clinic:"hello there",mr_no:patient.mrNumber,age:patient.age,sex:patient.sex,status:"waiting",reg_date: regDateTime,doctor:patient.doctor,consult_doctor:patient.consultationDoctor}).then((data)=> {
                    setClients(data.data)
                  }).catch((err)=> {
                    console.log(err)
                  })
                }
              })
            }else{
              console.log("writting patients")
              axios.post('http://localhost:5000/patients/register_patient',{name:patient.name,stage:"meds",clinic:"hello there",mr_no:patient.mrNumber,age:patient.age,sex:patient.sex,status:"waiting",reg_date: regDateTime,doctor:patient.doctor,consult_doctor:patient.consultationDoctor}).then((data)=> {
                //setClients(data.data)
                console.log(data.data)
              }).catch((err)=> {
                console.log(err)
              })
            }
          }else{
            console.log(`greater than 24`)
          }
        });
      };

    
      checkPatients();
    const intervalId = setInterval(() => {
      const newPatients = generatePatients();
      setPatients(newPatients);
      router.reload()
    }, 120000); // 10 seconds
    // }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [patients,status]);

  const getPatients = () => {
    setFetchLoading(true)
    axios.get('http://localhost:5000/patients/get_patients',{params: {status}}).then((data)=> {
      setClients(data.data)
      setFetchLoading(false)
      deleteDuplicates()
      // setInterval(()=> {
      //   deleteDuplicates()
      // },1000)
    }).catch((err)=> {
      setFetchLoading(false)
      console.log(err)
    })
  }
  const deleteDuplicates = () => {
    axios.put('http://localhost:5000/patients/duplicate_patients').then((data)=> {
      //setClients(data.data)
      // setFetchLoading(false)
    }).catch((err)=> {
      // setFetchLoading(false)
      console.log(err)
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
      //const swahiliFemaleVoice = voices.find((voice:any) => voice.lang === 'zh-TW' && voice.gender === 'female');
      const swahiliFemaleVoice = voices.find((voice:any) => voice.lang === 'sw-TZ');

      if (swahiliFemaleVoice) {
        utterance.voice = swahiliFemaleVoice;
      } else {
        console.warn('Swahili female voice not found.',voices.map((item:any)=> item.lang));
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
  const prepare01 = (id:string) => {
    finishPatient(id)
  }

  const editTicket = (id:string,status:string) => {
    setEdLoading(true)
    axios.put(`http://localhost:5000/patients/edit_status/${id}`,{status}).then((data:any)=> {
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
  const finishPatient = (id:string) => {
    setEdLoading(true)
    axios.put(`http://localhost:5000/patients/finish_patient/${id}`,{status}).then((data:any)=> {
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
    const generatePatient = () => {
        const categories = ['one', 'two', 'three', 'four'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomName = `Patient-${Math.floor(Math.random() * 1000)}`;
        const randomMRNumber = Math.floor(Math.random() * 100000);
        const randomAge = Math.floor(Math.random() * 100);
        const randomSex = Math.random() > 0.5 ? 'Male' : 'Female';
        const now = new Date();
        const regDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const regTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
        const consDate = regDate; // Assuming consultation date is the same as registration date
        const consTime = regTime; // Assuming consultation time is the same as registration time
        const randomDoctor = `Doctor-${Math.floor(Math.random() * 100)}`;
        const randomConsultationDoctor = `ConsultationDoctor-${Math.floor(Math.random() * 100)}`;
        const patientType = 'Outpatient';
        const patientCategory = 'General';
        const exemptionCategory = 'None';
        const initialDiagnosis = 'N/A';
        const creditCompanyName = 'N/A';
      
        return {
          name: randomName,
          category: randomCategory,
          mrNumber: randomMRNumber,
          age: randomAge,
          sex: randomSex,
          regDate,
          regTime,
          consDate,
          consTime,
          doctor: randomDoctor,
          consultationDoctor: randomConsultationDoctor,
          patientType,
          patientCategory,
          exemptionCategory,
          initialDiagnosis,
          creditCompanyName,
        };
      };
      
      // Function to generate an array of patients
      const generatePatients = (count = 10) => {
        const patients = [];
        for (let i = 0; i < count; i++) {
          patients.push(generatePatient());
        }
        return patients;
      };
  return (
    <div className={styles.meds}>
      {
        edLoading && (
          <div className={styles.overlay}>
            <div className={styles.conts}>
              <Cubes/>
            </div>
          </div>
        )
      }
      <div className={cx(styles.search_modal,search && styles.active)}>
        <div className={styles.bar}>
          <input 
          type="text" 
          value={ticket}
          onChange={e => setTicket(e.target.value)}
          placeholder='phone number..'
          />
          <div className={styles.search_button}>
          <IoSearch size={20} className={styles.icon___}/>
          </div>
        </div>
      </div>
        <div className={styles.meds_top}>
            <div className={styles.left}>{currentUser.name}| {currentUser.counter}</div>
            <div className={styles.right}>
            <div className={cx(styles.search,search && styles.active)} onClick={()=> setSearch(!search)}>
            {
              search 
              ? <MdOutlineClear size={20} className={styles.icon___}/>
              : <IoSearch size={20} className={styles.icon___}/>
            }
            </div>
            {/* <div className={styles.special}>
                <div className={cx(styles.one,specialIndex===1 && styles.active)} onClick={()=> setDisability(1,"normal")}>Normal</div>
                <div className={cx(styles.one,specialIndex===2 && styles.active)} onClick={()=> setDisability(2,"disabled")}>Special</div>
            </div> */}
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
                    clients.length<1
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
                            <h1>{clients.length>0 && clients[0].mr_no}</h1>
                          </div>
                          {/* <div className={styles.call} onClick={()=>handleSpeak(tickets[0].ticket_no)}> */}
                          <div className={styles.call} onClick={()=>handleSpeak(clients[0].mr_no)}>
                            <GiSpeaker size={150} className={cx(styles.click_icon,talking && styles.active)}/>
                          </div>
                          <div className={styles.two_other}>
                            <div className={styles.item} onClick={()=> prepare(clients[0].id,"pending")}>Pend</div>
                            <div className={styles.item_red} onClick={()=> prepare(clients[0].id,"cancelled")}>Cancel</div>
                          </div>
                          <div className={styles.finish} onClick={()=> prepare01(clients[0].id)}>Finish</div>
                          <div className={styles.reload} onClick={()=> reloda()}>{refresh?<SlRefresh className={styles.icon}/>:"Refresh"}</div>
                          </div>
                        </div>
                        <table className={cx(styles.table,full && styles.full)}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ticket</th>
                                    <th>name</th>
                                    <th>age</th>
                                </tr>
                            </thead>
                            {
                              clients.length>0 && (
                                <tbody>
                              {
                              clients.map((item:any,index:number)=> (
                                      <tr key={index} className={cx(index%2===0 && styles.even)}>
                                          <td>{item.id}</td>
                                          <td>{item.mr_no}</td>
                                          <td>{item.name}</td>
                                          <td>{item.age}</td>
                                      </tr>
                                  ))
                              } 
                            </tbody>
                              )
                            }
                        </table>
                        </div>
                    </div>
                }
            </div>
        }
        {
          clients.length > 0 && (<div className={styles.bottom_desc}>
            <div className={styles.top}>
              <div className={styles.item}>
                <p>On Queue: <span> <Medicine_Category_Length stage="meds" status='waiting'/> </span> </p>
              </div>
              <div className={styles.item}>
                <p>Attended: <span><Medicine_Category_Length stage="meds" status='done'/></span> </p>
              </div>
              <div className={styles.item}>
                <p>Pending: <span><Medicine_Category_Length stage="meds" status='pending'/></span> </p>
              </div>
              <div className={styles.item}>
                <p>Cancelled: <span><Medicine_Category_Length stage="meds" status='cancelled'/></span> </p>
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

export default OutPatients