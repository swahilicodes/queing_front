import currentUserState from '@/store/atoms/currentUser'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import styles from './patient_doc.module.scss'
import { HiOutlineSpeakerphone } from 'react-icons/hi'
import { RiSendPlaneLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import Cubes from '@/components/loaders/cubes/cubes'
import cx from 'classnames'

export default function DoctorPatient() {
 const currentUser:any = useRecoilValue(currentUserState)
 const [pat, setPat] = useState<any>({})
 const [loading, setLoading] = useState(false)
 const router = useRouter()
 const [finish, setFinish] = useState(false)
 const [finLoading, setFinLoading] = useState(false)
 useEffect(()=> {
    if(Object.keys(currentUser).length > 0 ){
        getDocPat()
    }
 },[currentUser])

 const getDocPat = () => {
    axios.get(`http://localhost:5000/tickets/clinic_patient`,{params: {clinic_code: currentUser.clinic_code}}).then((data)=> {
        setPat(data.data)
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
 const editDoctor = () => {
    setLoading(true)
    axios.get(`http://localhost:5000/doctors/finish_doctor_patient`,{params: {phone: currentUser.phone}}).then((data)=> {
        setPat(data.data)
        setLoading(false)
        router.reload()
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

 const finishToken = () => {
    setFinLoading(true)
    setInterval(()=> {
        setFinLoading(false)
        setFinish(false)
        router.reload()
    },10000)
 }
  return (
    <div className={styles.patient_doc}>
        {
            finish && ( <div className={styles.overlay}>
                <div className={cx(styles.data,finLoading && styles.active)}>
                    <div className={cx(styles.title,finLoading && styles.active)}>Are You Sure!</div>
                    <div className={cx(styles.actions,finLoading && styles.active)}>
                        <div className={styles.action} onClick={finishToken}>Yes</div>
                        <div className={styles.action} onClick={()=> setFinish(false)}>Cancel</div>
                    </div>
                    <div className={cx(styles.loader,finLoading && styles.active)}>
                    <div className={styles.inside}></div>
                    </div>
                </div>
            </div> )
        }
        {
            loading && ( <div className={styles.overlay}>
                <Cubes/>
            </div> )
        }
        <div className={styles.doc_top}>
            <div className={styles.side}>{router.pathname}</div>
            <div className={styles.side}></div>
        </div>
        {
            // Object.keys(pat).length>0
            pat
            ? <div className={styles.wrap}>
                <div className={styles.doc_pat}>
                <table>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>mr_no</th>
                        <th>sex</th>
                        <th>Token</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>{pat.mr_no}</td>
                            <td>{pat.gender}</td>
                            <td>{pat.ticket_no}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className={styles.doc_action}>
                    <div className={styles.acta} onClick={()=> setFinish(true)}>Finish</div>
                    {/* <HiOutlineSpeakerphone className={styles.icon} size={100}/>
                    <div className={styles.acta} onClick={()=> editDoctor()}>Finish</div> */}
                </div>
            </div>
            : <div className={styles.wrap}>
                <div className={styles.wait}>
                    <h1>No Waiting Patient</h1>
                </div>
            </div>
        }
    </div>
  )
}
