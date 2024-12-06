import currentUserState from '@/store/atoms/currentUser'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import styles from './patient_doc.module.scss'
import { useRouter } from 'next/router'
import Cubes from '@/components/loaders/cubes/cubes'
import cx from 'classnames'
import { GiPowerButton } from 'react-icons/gi'
import { IoIosAdd, IoMdAdd } from 'react-icons/io'
import useFetchData from '@/custom_hooks/fetch'
import { FiMinus } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'

export default function DoctorPatient() {
 const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState)
 const [pat, setPat] = useState<any>({})
 const [loading, setLoading] = useState(false)
 const router = useRouter()
 const [finish, setFinish] = useState(false)
 const [finLoading, setFinLoading] = useState(false)
 const [isAddittion, setAddittion] = useState(false)
 const [isAdd, setAdd] = useState(false)
 const [jeevaClinics, setJeevaClinics] = useState([])
 const [attendantClinics, setAttendantClinics] = useState([])
 const {data} = useFetchData("http://192.168.30.245:5000/clinic/get_clinics")
 const [fields, setFields] = useState({
    clinic: "",
    clinic_code: ""
 })
 useEffect(()=> {
    if(Object.keys(currentUser).length > 0 ){
        getDocPat()
        getDocClinics()
        console.log(currentUser)
    }
 },[currentUser])

 const getDocPat = () => {
    axios.get(`http://192.168.30.245:5000/tickets/clinic_patient`,{params: {clinic_code: currentUser.clinic_code}}).then((data)=> {
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
 const createClinic = () => {
    axios.post(`http://192.168.30.245:5000/attendant_clinics/create_attendant_clinic`,{clinic_code: fields.clinic_code,clinic: fields.clinic, attendant_id: currentUser.phone}).then((data)=> {
        //setPat(data.data)
        setAddittion(!isAddittion)
        getDocClinics()
        setTimeout(()=> {
        attendantClinics.map((item)=> item)
        },2000)
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
 const deleteClinic = (clinic_code:string) => {
    axios.get(`http://192.168.30.245:5000/attendant_clinics/delete_clinic`,{params: {clinic_code: clinic_code,attendant_id: currentUser.phone}}).then((data)=> {
        const updatedItems = attendantClinics.filter((item:any) => item.clinic_code !== clinic_code);
        setAttendantClinics(updatedItems.map((item)=> item));
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
 const getDocClinics = () => {
    axios.get(`http://192.168.30.245:5000/attendant_clinics/get_clinics`,{params: {attendant_id: currentUser.phone}}).then((data)=> {
        setAttendantClinics(data.data)
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
 const signOut = () => {
    localStorage.removeItem('token')
    setCurrentUser({})
    router.reload()
 }

 const finishToken = () => {
    setFinLoading(true)
    axios.post("http://192.168.30.245:5000/doktas/finish_patient",{doctor_id: currentUser.phone,patient_id: pat.mr_no}).then((data)=> {
        console.log(data)
        setInterval(()=> {
            setFinLoading(false)
            setFinish(false)
            router.reload()
        },2000)
    }).catch((error)=> {
        console.log(error)
        setFinLoading(false)
        setFinish(false)
    })
 }
 const handleClinic = (code:string) => {
    const clinic = data.find((item: { clinicicode: string })=> item.clinicicode === code)
    setFields({...fields,clinic: clinic.cliniciname,clinic_code: code})
 }
  return (
    <div className={styles.patient_doc}>
        {
            isAdd && (
                <div className={styles.overlay}>
                    <div className={styles.contents}>
                        <div className={styles.close} onClick={()=> setAdd(false)}>close</div>
                        <div className={styles.top}>
                            <div className={styles.left}>
                                <h1>{currentUser.role}'s clinics</h1>
                            </div>
                            <div className={styles.left}>
                                <div className={styles.act} onClick={()=> setAddittion(!isAddittion)}>
                                    {
                                        !isAddittion
                                        ? <IoIosAdd className={styles.icon____} size={20}/>
                                        : <FiMinus className={styles.icon____} size={20}/>
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            isAddittion
                            ? <div className={styles.addittion}>
                            <select
                            value={fields.clinic_code}
                            onChange={e => handleClinic(e.target.value)}
                            >
                                <option value="">--Select an option--</option>
                                {
                                    data.map((item: { clinicicode: string | number | readonly string[] | undefined; cliniciname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined },index:number)=> (
                                        <option value={item.clinicicode} key={index}>{item.cliniciname}</option>
                                    ))
                                }
                            </select>
                            <button onClick={()=> createClinic()}>submit</button>
                            </div>
                            : <div className={styles.display_clinics}>
                                {
                                    attendantClinics.map((item:any,index)=> (
                                        <div className={styles.display_item} key={index}>
                                            <div className={styles.name}>{item.clinic}</div>
                                            <div className={styles.delete} onClick={()=>deleteClinic(item.clinic_code)}>
                                                <MdDeleteOutline className={styles.icona}/>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    attendantClinics.length===0 && (
                                        <h2>No Clinics</h2>
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
            )
        }
        {
            finish && ( <div className={styles.overlay}>
                <div className={cx(styles.data,finLoading && styles.active)}>
                    <div className={cx(styles.title,finLoading && styles.active)}>Are You Sure!</div>
                    <div className={cx(styles.actions,finLoading && styles.active)}>
                        <div className={styles.action} onClick={finishToken}>Yes</div>
                        <div className={styles.action} onClick={()=> setFinish(false)}>Cancel</div>
                    </div>
                    <div className={cx(styles.loader,finLoading && styles.active)}>
                    <div className={styles.inside}>
                    </div>
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
            <div className={styles.side}>{currentUser.name !== undefined && <h4>{currentUser.name}| <span>{currentUser.role} | {currentUser.room}</span></h4> }</div>
            <div className={styles.side}>
            <div className={styles.icon} onClick={()=> setAdd(!isAdd)}>
            <IoMdAdd className={styles.icon_}/>
            </div>
            <div className={styles.icon} onClick={signOut}>
            <GiPowerButton className={styles.icon_}/>
            </div>
            </div>
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
                        <th>Name</th>
                        <th>Age</th>
                        <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>{pat.mr_no}</td>
                            <td>{pat.gender}</td>
                            <td>{pat.name}</td>
                            <td>{pat.age}</td>
                            <td>{pat.category}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className={styles.doc_action}>
                    <div className={styles.acta} onClick={()=> setFinish(true)}>Finish</div>
                </div>
            </div>
            : <div className={styles.wrap}>
                <div className={styles.wait}>
                    <h1>No Assigned Patient</h1>
                </div>
            </div>
        }
    </div>
  )
}
