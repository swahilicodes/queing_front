import currentUserState from '@/store/atoms/currentUser'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import styles from './patient_doc.module.scss'
import { useRouter } from 'next/router'
import Cubes from '@/components/loaders/cubes/cubes'
import cx from 'classnames'
import { GiPowerButton } from 'react-icons/gi'
import { IoIosAdd, IoMdAdd } from 'react-icons/io'
import useFetchData from '@/custom_hooks/fetch'
import { FiMinus } from 'react-icons/fi'
import { MdDeleteOutline } from 'react-icons/md'
import messageState from '@/store/atoms/message'
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2'
import useCreateItem from '@/custom_hooks/useCreateItem'
import isSpeakerState from '@/store/atoms/isSpeaker'
import isUserState from '@/store/atoms/isUser'
import { FaUserEdit } from 'react-icons/fa'
import DisplayCounter from '@/components/display_counter/display_counter'

export default function DoctorPatient() {
    const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState)
    const [pat, setPat] = useState<any>([])
    //const [loading, setLoading] = useState(false)
    const [isEdit, setEdit] = useState(false)
    const router = useRouter()
    const [finish, setFinish] = useState(false)
    const [finLoading, setFinLoading] = useState(false)
    const [isAddittion, setAddittion] = useState(false)
    const [isAdd, setAdd] = useState(false)
    const [jeevaClinics, setJeevaClinics] = useState([])
    const [attendantClinics, setAttendantClinics] = useState([])
    const { data } = useFetchData("http://localhost:5000/clinic/get_clinics")
    const { createItem, loading } = useCreateItem()
    const [fetchLoading, setFetchLoading] = useState(false);
    const [isSpeaker, setSpeaker] = useRecoilState(isSpeakerState)
    const setMessage = useSetRecoilState(messageState)
    const [isUser, setUser] = useRecoilState(isUserState)
    const [doktas, setDoktas] = useState([])
    const [status, setStatus] = useState("waiting")
    const [isSure,setSure] = useState(false)
    const [mr_no,setMrNo] = useState("")
    const [fields, setFields] = useState({
        clinic: "",
        clinic_code: "",
        name: "",
        room: "",
        password: "",
    })
    useEffect(() => {
        getDoktas()
        if (Object.keys(currentUser).length > 0) {
            getDocPat()
            getDocClinics()
            setFields({...fields,name:currentUser.name,clinic:currentUser.clinic})
        }
    }, [currentUser, status])

    const changeClinic = (e:string) => {
        const code:any = data.find((item:any)=> item.cliniciname===e)
        setFields({...fields,clinic:e.toString(),clinic_code: code.clinicicode})

    }


    const getDoktas = () => {
        axios.get("http://localhost:5000/doktas/get_all_doktas")
            .then((data) => {
                setDoktas(data.data);
                console.log('doktas are ', data.data)
            })
            .catch((error) => {
                console.log('get doktas error ', error.response.status)
                if (error.response && error.response.status === 400) {
                    console.log(`there is an error ${error.message}`);
                    setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
                } else {
                    console.log(`there is an error message ${error.message}`);
                    setMessage({ ...onmessage, title: error.message, category: "error" })
                }
            });
    };

    const editDoctor = (e:React.FormEvent) => {
        e.preventDefault()
        axios.post("http://localhost:5000/doktas/edit_doctor",{
            name: fields.name, 
            clinic: fields.clinic,
            clinic_code: fields.clinic_code, 
            room: fields.room,
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then((data)=> {
            location.reload()
        }).catch((error)=> {
            console.log(error)
        })
    }

    const getRoom = (id: number) => {
        console.log(doktas)
        const room: any = doktas.find((item: any) => item.id === id)
        return room.room
    }
    const editTicket = (id: number, status: string) => {
        setFetchLoading(true);
        axios.put(`http://localhost:5000/tickets/edit_ticket/${id}`, { status: status })
            .then(() => {
                setInterval(() => {
                    setFetchLoading(false);
                    router.reload()
                }, 2000);
            })
            .catch((error) => {
                setFetchLoading(false);
                if (error.response && error.response.status === 400) {
                    console.log(`there is an error ${error.message}`);
                    setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
                } else {
                    console.log(`there is an error message ${error.message}`);
                    setMessage({ ...onmessage, title: error.message, category: "error" })
                }
            });
    };

    const handleFinish = (mr_no:string) => {
        setSure(true)
        setMrNo(mr_no)
    } 

    const priotize = (ticket_no: string, data: string, counter: number) => {
        setFetchLoading(true);
        axios.get(`http://localhost:5000/tickets/priority`, {
            params: { ticket_no, data, stage: "nurse_station", counter: counter }, headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                setInterval(() => {
                    setFetchLoading(false);
                    router.reload()
                }, 2000);
            })
            .catch((error) => {
                setFetchLoading(false);
                if (error.response && error.response.status === 400) {
                    console.log(`there is an error ${error.message}`);
                    setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
                } else {
                    console.log(`there is an error message ${error.message}`);
                    setMessage({ ...onmessage, title: error.message, category: "error" })
                }
            });
    };

    const getDocPat = () => {
        setFetchLoading(true)
        axios.get(`http://localhost:5000/doktas/get_doc_patients`, {
            params: { status: status },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((data) => {
            setPat(data.data)
            setFetchLoading(false)
        }).catch((error) => {
            setFetchLoading(false)
            if (error.response && error.response.status === 400) {
                setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
                setTimeout(() => {
                    setMessage({ ...onmessage, title: "", category: "" })
                }, 5000)
            } else {
                setMessage({ ...onmessage, title: error.message, category: "error" })
                setTimeout(() => {
                    setMessage({ ...onmessage, title: "", category: "" })
                }, 5000)
            }
        })
    }
    const createClinic = () => {
        axios.post(`http://localhost:5000/attendant_clinics/create_attendant_clinic`, { clinic_code: fields.clinic_code, clinic: fields.clinic, attendant_id: currentUser.phone }).then((data) => {
            //setPat(data.data)
            setAddittion(!isAddittion)
            getDocClinics()
            setTimeout(() => {
                attendantClinics.map((item) => item)
            }, 2000)
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                console.log(`there is an error ${error.message}`)
                setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
                setTimeout(() => {
                    setMessage({ ...onmessage, title: "", category: "" })
                }, 5000)
            } else {
                setMessage({ ...onmessage, title: error.message, category: "error" })
                setTimeout(() => {
                    setMessage({ ...onmessage, title: "", category: "" })
                }, 5000)
            }
        })
    }
    const deleteClinic = (clinic_code: string) => {
        axios.get(`http://localhost:5000/attendant_clinics/delete_clinic`, { params: { clinic_code: clinic_code, attendant_id: currentUser.phone } }).then((data) => {
            const updatedItems = attendantClinics.filter((item: any) => item.clinic_code !== clinic_code);
            setAttendantClinics(updatedItems.map((item) => item));
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
                setTimeout(() => {
                    setMessage({ ...onmessage, title: "", category: "" })
                }, 5000)
            } else {
                setMessage({ ...onmessage, title: error.message, category: "error" })
                setTimeout(() => {
                    setMessage({ ...onmessage, title: "", category: "" })
                }, 5000)
            }
        })
    }
    const getDocClinics = () => {
        axios.get(`http://localhost:5000/attendant_clinics/get_clinics`, { params: { attendant_id: currentUser.phone } }).then((data) => {
            setAttendantClinics(data.data)
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                setMessage({ ...onmessage, title: error.response.data.error, category: "error" })
                setTimeout(() => {
                    setMessage({ ...onmessage, title: "", category: "" })
                }, 5000)
            } else {
                setMessage({ ...onmessage, title: error.message, category: "error" })
                setTimeout(() => {
                    setMessage({ ...onmessage, title: "", category: "" })
                }, 5000)
            }
        })
    }
    const signOut = () => {
        localStorage.removeItem('token')
        setCurrentUser({})
        router.reload()
    }

    const finishToken = (patient_id: string) => {
        console.log('finishing patient')
        setFinLoading(true)
        axios.post("http://localhost:5000/doktas/finish_patient", { doctor_id: currentUser.id, patient_id: patient_id }).then((data) => {
            console.log(data)
            setInterval(() => {
                setFinLoading(false)
                setFinish(false)
                //router.reload()
            }, 2000)
        }).catch((error) => {
            console.log(error)
            setFinLoading(false)
            setFinish(false)
        })
    }
    const handleClinic = (code: string) => {
        const clinic = data.find((item: { clinicicode: string }) => item.clinicicode === code)
        setFields({ ...fields, clinic: clinic.cliniciname, clinic_code: code })
    }
    return (
        <div className={styles.patient_doc}>
            {
                isEdit && (
                    <div className={styles.edit_overlay}>
                        <div className={styles.edit_content}>
                            <div className={styles.close} onClick={()=> setEdit(false)}>close</div>
                            <form onSubmit={editDoctor}>
                                <div className={styles.input_item}>
                                    <label>Name:</label>
                                    <input 
                                    type="text" 
                                    placeholder='Enter Name'
                                    value={fields.name}
                                    onChange={e => setFields({...fields,name:e.target.value})}
                                    />
                                </div>
                                <div className={styles.input_item}>
                                    <label>Room:</label>
                                    <input 
                                    type="text" 
                                    placeholder='Enter Room'
                                    value={fields.room}
                                    onChange={e => setFields({...fields,room:e.target.value})}
                                    />
                                </div>
                                <div className={styles.input_item}>
                                    <label>Clinic:</label>
                                    <select
                                    value={fields.clinic}
                                    onChange={e => changeClinic(e.target.value)}
                                    >
                                        <option value="" selected disabled>--Select--</option>
                                        {
                                            data.map((item:any,index:any)=> (
                                                <option value={item.cliniciname}>{item.cliniciname}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <button type='submit'>Submit</button>
                            </form>
                        </div>
                    </div>
                )
            }
            {
                isSure && (
                    <div className={styles.finOverlay}>
                        <div className={styles.content}>
                            <div className={styles.wrap}>
                            <div className={styles.title}>Are You Sure</div>
                            <div className={styles.actions}>
                                <div className={styles.action} onClick={()=> setSure(false)}>Cancel</div>
                                <div className={cx(styles.action,styles.active)} onClick={()=> finishToken(mr_no)}>Finish</div>
                            </div>
                            </div>
                            <div className={cx(styles.loader,finLoading && styles.active)}>
                                <div className={styles.inside}></div>
                            </div>
                        </div>
                    </div> 
                )
            }
            {
                isAdd && (
                    <div className={styles.overlay}>
                        <div className={styles.contents}>
                            <div className={styles.close} onClick={() => setAdd(false)}>close</div>
                            <div className={styles.top}>
                                <div className={styles.left}>
                                    <h1>{currentUser.role}'s clinics</h1>
                                </div>
                                <div className={styles.left}>
                                    <div className={styles.act} onClick={() => setAddittion(!isAddittion)}>
                                        {
                                            !isAddittion
                                                ? <IoIosAdd className={styles.icon____} size={20} />
                                                : <FiMinus className={styles.icon____} size={20} />
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
                                                data.map((item: { clinicicode: string | number | readonly string[] | undefined; cliniciname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined }, index: number) => (
                                                    <option value={item.clinicicode} key={index}>{item.cliniciname}</option>
                                                ))
                                            }
                                        </select>
                                        <button onClick={() => createClinic()}>submit</button>
                                    </div>
                                    : <div className={styles.display_clinics}>
                                        {
                                            attendantClinics.map((item: any, index) => (
                                                <div className={styles.display_item} key={index}>
                                                    <div className={styles.name}>{item.clinic}</div>
                                                    <div className={styles.delete} onClick={() => deleteClinic(item.clinic_code)}>
                                                        <MdDeleteOutline className={styles.icona} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {
                                            attendantClinics.length === 0 && (
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
                loading && (<div className={styles.overlay}>
                    <Cubes />
                </div>)
            }
            <div className={styles.doc_top}>
                <div className={styles.left}>
                    <div className={styles.side}>{currentUser.name !== undefined && <h4>{currentUser.name}| <span>{currentUser.role} | {getRoom(currentUser.id)}</span></h4>}</div>
                </div>
                <div className={styles.right}>
                    <div className={styles.side}>
                        <label>Status:</label>
                        <select onChange={(e) => setStatus(e.target.value)} value={status}>
                            <option value="waiting">waiting</option>
                            <option value="done">done</option>
                            <option value="cancelled">cancelled</option>
                            <option value="pending">pending</option>
                        </select>
                    </div>
                    <div className={styles.side}>
                        <div className={styles.icon} onClick={signOut}>
                            <GiPowerButton className={styles.icon_} />
                        </div>
                    </div>
                    <div className={styles.side} onClick={()=> setEdit(true)}>
                        <div className={styles.edit_icon}>
                            <FaUserEdit className={styles.icon__}/>
                        </div>
                    </div>
                    <div className={styles.side}>
                        <div className={styles.image} style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }} onClick={() => setUser(true)}>
                            <img src="/place_holder.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        </div>
                    </div>
                </div>
            </div>
            {
                // Object.keys(pat).length>0
                pat.length > 0
                    ? <div className={styles.wrap}>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pat.map((item: any, index: number) => (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.mr_no}</td>
                                            <td>{item.gender}</td>
                                            <td>{item.ticket_no}</td>
                                            <td>{item.name}</td>
                                            <td>{item.age}</td>
                                            <td>{item.category}</td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <div className={styles.action}>
                                                        <div className={cx(styles.serve, item.serving && styles.active)} onClick={() => priotize(`${item.ticket_no}`, "serve", getRoom(currentUser.id))}>{item.serving === true ? "serving" : "Serve"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            pat !== null && pat.filter((item: any) => item.serving === true && item.serving_id === currentUser.phone).map((item: any, index: number) => (
                                <div
                                    className={cx(
                                        styles.serving,
                                        pat.length > 0 && !fetchLoading && styles.active
                                    )}
                                >
                                    <div className={cx(styles.spika, loading && styles.active)} onClick={() => setSpeaker(!isSpeaker)}>
                                        <div className={styles.rounder} onClick={() => createItem(item.ticket_no.toString(), "clinic", "m02", "http://localhost:5000/speaker/create_speaker", getRoom(currentUser.id))}>
                                            {
                                                !loading
                                                    ? <HiOutlineSpeakerWave className={styles.icon} size={30} />
                                                    : <HiOutlineSpeakerXMark className={styles.icon} size={30} />
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.row}>
                                        <div className={styles.row_item} onClick={() => editTicket(item.id, status === "pending" ? "waiting" : "pending")}>
                                            <div className={styles.button}>{status === "pending" ? "Unpend" : "Pend"}</div>
                                        </div>
                                        <div className={styles.row_item}>
                                            <div className={styles.token}>{pat.length > 0 && item.ticket_no}</div>
                                        </div>
                                        {/* <div className={styles.row_item} onClick={() => handleNext(item)}> */}
                                        <div className={styles.row_item} onClick={() => handleFinish(item.mr_no)}>
                                            <div className={styles.button}>Finish</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    : <div className={styles.message}>
                        {
                            fetchLoading
                            ?<div className={styles.wait}>
                                <Cubes/>
                            </div>
                            :<div className={styles.wait}>
                                <h1>No Assigned Patient</h1>
                            </div> 
                        }
                    </div>
            }
        </div>
    )
}
