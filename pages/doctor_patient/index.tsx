import currentUserState from '@/store/atoms/currentUser'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
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
import styles from './patient_doc.module.scss'

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DoctorPatient() {
    const [currentUser, setCurrentUser] = useRecoilState<any>(currentUserState)
    const [pat, setPat] = useState<any>([])
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
    const [fetchLoading, setFetchLoading] = useState(false)
    const [isSpeaker, setSpeaker] = useRecoilState(isSpeakerState)
    const setMessage = useSetRecoilState(messageState)
    const [isUser, setUser] = useRecoilState(isUserState)
    const [doktas, setDoktas] = useState([])
    const [status, setStatus] = useState("waiting")
    const [isSure, setSure] = useState(false)
    const [mr_no, setMrNo] = useState("")
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [fields, setFields] = useState({
        clinic: "",
        clinic_code: "",
        name: "",
        room: "",
        password: "",
        status: "active"
    })

    useEffect(() => {
        getDoktas()
        if (Object.keys(currentUser).length > 0) {
            getDocPat()
            getDocClinics()
            setFields({...fields, name: currentUser.name, clinic: currentUser.clinic,status: currentUser.status,room: currentUser.status})
        }
    }, [currentUser, status,page,pages])

    const changeClinic = (e: string) => {
        const code: any = data.find((item: any) => item.cliniciname === e)
        setFields({...fields, clinic: e.toString(), clinic_code: code.clinicicode})
    }

    const getDoktas = () => {
        axios.get("http://localhost:5000/doktas/get_all_doktas")
            .then((data) => {
                setDoktas(data.data)
            })
            .catch((error) => {
                console.log('get doktas error ', error.response.status)
                if (error.response && error.response.status === 400) {
                    setMessage({ title: error.response.data.error, category: "error" })
                } else {
                    setMessage({ title: error.message, category: "error" })
                }
            })
    }

    function cliniccode(clinicName:string) {
    const clinic = data.find((item:any) => item.cliniciname === clinicName);
    console.log('clinic found is ',clinic)
    return clinic ? clinic.clinicicode : null;
}
    const editDoctor = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("clinic code is",cliniccode(fields.clinic))
        axios.post("http://localhost:5000/doktas/edit_doctor_one", {
            name: fields.name, 
            clinic: fields.clinic,
            clinic_code: cliniccode(fields.clinic), 
            room: fields.room,
            status: fields.status
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(() => {
            location.reload()
        }).catch((error) => {
            console.log(error)
        })
    }

    const getRoom = (id: number) => {
        const room: any = doktas.find((item: any) => item.id === id)
        return room?.room || ''
    }

    const editTicket = (id: number, status: string) => {
        setFetchLoading(true)
        axios.put(`http://localhost:5000/tickets/edit_ticket/${id}`, { status })
            .then(() => {
                setTimeout(() => {
                    setFetchLoading(false)
                    router.reload()
                }, 2000)
            })
            .catch((error) => {
                setFetchLoading(false)
                if (error.response && error.response.status === 400) {
                    setMessage({ title: error.response.data.error, category: "error" })
                } else {
                    setMessage({ title: error.message, category: "error" })
                }
            })
    }

    const handleFinish = (mr_no: string) => {
        setSure(true)
        setMrNo(mr_no)
    }

    const priotize = (ticket_no: string, data: string, counter: number) => {
        setFetchLoading(true)
        axios.get(`http://localhost:5000/tickets/priority`, {
            params: { ticket_no, data, stage: "nurse_station", counter },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                setTimeout(() => {
                    setFetchLoading(false)
                    router.reload()
                }, 2000)
            })
            .catch((error) => {
                setFetchLoading(false)
                if (error.response && error.response.status === 400) {
                    setMessage({ title: error.response.data.error, category: "error" })
                } else {
                    setMessage({ title: error.message, category: "error" })
                }
            })
    }

    const getDocPat = () => {
        setFetchLoading(true)
        axios.get(`http://localhost:5000/doktas/get_doc_patients`, {
            params: { status,page },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((data) => {
            console.log('doctor patients are',data)
            setPat(data.data.patients)
            setPages(data.data.totalPages)
            setFetchLoading(false)
        }).catch((error) => {
            setFetchLoading(false)
            if (error.response && error.response.status === 400) {
                setMessage({ title: error.response.data.error, category: "error" })
                setTimeout(() => setMessage({ title: "", category: "" }), 5000)
            } else {
                setMessage({ title: error.message, category: "error" })
                setTimeout(() => setMessage({ title: "", category: "" }), 5000)
            }
        })
    }

    const createClinic = () => {
        axios.post(`http://localhost:5000/attendant_clinics/create_attendant_clinic`, { 
            clinic_code: fields.clinic_code, 
            clinic: fields.clinic, 
            attendant_id: currentUser.phone 
        }).then(() => {
            setAddittion(!isAddittion)
            getDocClinics()
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                setMessage({ title: error.response.data.error, category: "error" })
                setTimeout(() => setMessage({ title: "", category: "" }), 5000)
            } else {
                setMessage({ title: error.message, category: "error" })
                setTimeout(() => setMessage({ title: "", category: "" }), 5000)
            }
        })
    }

    const deleteClinic = (clinic_code: string) => {
        axios.get(`http://localhost:5000/attendant_clinics/delete_clinic`, { 
            params: { clinic_code, attendant_id: currentUser.phone }
        }).then(() => {
            const updatedItems = attendantClinics.filter((item: any) => item.clinic_code !== clinic_code)
            setAttendantClinics(updatedItems)
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                setMessage({ title: error.response.data.error, category: "error" })
                setTimeout(() => setMessage({ title: "", category: "" }), 5000)
            } else {
                setMessage({ title: error.message, category: "error" })
                setTimeout(() => setMessage({ title: "", category: "" }), 5000)
            }
        })
    }

    const getDocClinics = () => {
        axios.get(`http://localhost:5000/attendant_clinics/get_clinics`, { 
            params: { attendant_id: currentUser.phone }
        }).then((data) => {
            setAttendantClinics(data.data)
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                setMessage({ title: error.response.data.error, category: "error" })
                setTimeout(() => setMessage({ title: "", category: "" }), 5000)
            } else {
                setMessage({ title: error.message, category: "error" })
                setTimeout(() => setMessage({ title: "", category: "" }), 5000)
            }
        })
    }

    const signOut = () => {
        localStorage.removeItem('token')
        setCurrentUser({})
        router.reload()
    }

    const finishToken = (patient_id: string) => {
        setFinLoading(true)
        axios.post("http://localhost:5000/doktas/finish_patient", { 
            doctor_id: currentUser.id, 
            patient_id 
        }).then(() => {
            setTimeout(() => {
                setFinLoading(false)
                setFinish(false)
                router.reload()
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

    const Pagination: React.FC<PaginationProps> = ({ currentPage, hasNextPage, hasPreviousPage, totalPages, onPageChange }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', padding: '20px' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        style={{
          padding: '8px 16px',
          background: hasPreviousPage ? '#0070f3' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: hasPreviousPage ? 'pointer' : 'not-allowed'
        }}
      >
        Previous
      </button>
      
      <span style={{ alignSelf: 'center' }}>
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        style={{
          padding: '8px 16px',
          background: hasNextPage ? '#0070f3' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: hasNextPage ? 'pointer' : 'not-allowed'
        }}
      >
        Next
      </button>
    </div>
  );
};

    return (
        <div className={styles.patientDoc}>
            {isEdit && (
                <div className={styles.editOverlay}>
                    <div className={styles.editContent}>
                        <div className={styles.close} onClick={() => setEdit(false)}>×</div>
                        <form onSubmit={editDoctor}>
                            <div className={styles.inputItem}>
                                <label>Name</label>
                                <input 
                                    type="text" 
                                    placeholder='Enter Name'
                                    value={fields.name}
                                    onChange={e => setFields({...fields, name: e.target.value})}
                                />
                            </div>
                            <div className={styles.inputItem}>
                                <label>Room</label>
                                <input 
                                    type="text" 
                                    placeholder='Enter Room'
                                    value={fields.room}
                                    onChange={e => setFields({...fields, room: e.target.value})}
                                />
                            </div>
                            <div className={styles.inputItem}>
                                <label>Status</label>
                                <select
                                value={fields.status}
                                onChange={e => setFields({...fields, status: e.target.value})}
                                >
                                    <option value="" selected disabled>-select-</option>
                                    <option value="active">active</option>
                                    <option value="inactive">in active</option>
                                </select>
                            </div>
                            <div className={styles.inputItem}>
                                <label>Clinic</label>
                                <select
                                    value={fields.clinic}
                                    onChange={e => changeClinic(e.target.value)}
                                >
                                    <option value="" disabled>--Select--</option>
                                    {data.map((item: any, index: number) => (
                                        <option key={index} value={item.cliniciname}>{item.cliniciname}</option>
                                    ))}
                                </select>
                            </div>
                            <button type='submit'>Update Profile</button>
                        </form>
                    </div>
                </div>
            )}
            {isSure && (
                <div className={styles.finOverlay}>
                    <div className={styles.content}>
                        <div className={styles.wrap}>
                            <div className={styles.title}>Confirm Completion</div>
                            <div className={styles.actions}>
                                <button className={styles.action} onClick={() => setSure(false)}>Cancel</button>
                                <button className={cx(styles.action, styles.active)} onClick={() => finishToken(mr_no)}>Confirm</button>
                            </div>
                        </div>
                        <div className={cx(styles.loader, finLoading && styles.active)}>
                            <div className={styles.inside}></div>
                        </div>
                    </div>
                </div> 
            )}
            {isAdd && (
                <div className={styles.overlay}>
                    <div className={styles.contents}>
                        <div className={styles.close} onClick={() => setAdd(false)}>×</div>
                        <div className={styles.top}>
                            <div className={styles.left}>
                                <h1>{currentUser.role}'s Clinics</h1>
                            </div>
                            <div className={styles.left}>
                                <button className={styles.act} onClick={() => setAddittion(!isAddittion)}>
                                    {isAddittion ? <FiMinus size={20} /> : <IoIosAdd size={20} />}
                                </button>
                            </div>
                        </div>
                        {isAddittion ? (
                            <div className={styles.addittion}>
                                <select
                                    value={fields.clinic_code}
                                    onChange={e => handleClinic(e.target.value)}
                                >
                                    <option value="">--Select Clinic--</option>
                                    {data.map((item: any, index: number) => (
                                        <option value={item.clinicicode} key={index}>{item.cliniciname}</option>
                                    ))}
                                </select>
                                <button onClick={createClinic}>Add Clinic</button>
                            </div>
                        ) : (
                            <div className={styles.displayClinics}>
                                {attendantClinics.length === 0 ? (
                                    <h2>No Clinics Assigned</h2>
                                ) : (
                                    attendantClinics.map((item: any, index: number) => (
                                        <div className={styles.displayItem} key={index}>
                                            <div className={styles.name}>{item.clinic}</div>
                                            <button className={styles.delete} onClick={() => deleteClinic(item.clinic_code)}>
                                                <MdDeleteOutline />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* {loading && (
                <div className={styles.overlay}>
                    <Cubes />
                </div>
            )} */}
            <div className={styles.docTop}>
                <div className={styles.left}>
                    <div className={styles.side}>
                        {currentUser.name && (
                            <h4>
                                {currentUser.name} | <span>{currentUser.role} | {getRoom(currentUser.id)}</span>
                            </h4>
                        )}
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.side}>
                        <label>Status</label>
                        <select onChange={(e) => setStatus(e.target.value)} value={status}>
                            <option value="waiting">Waiting</option>
                            <option value="done">Done</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <div className={styles.side}>
                        <button className={styles.icon} onClick={signOut}>
                            <GiPowerButton />
                        </button>
                    </div>
                    <div className={styles.side}>
                        <button className={styles.editIcon} onClick={() => setEdit(true)}>
                            <FaUserEdit />
                        </button>
                    </div>
                    <div className={styles.side}>
                        <div className={styles.image} onClick={() => setUser(true)}>
                            <img src="/place_holder.png" alt="Profile" />
                        </div>
                    </div>
                </div>
            </div>
            {pat.length > 0 ? (
                <div className={styles.wrap}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>MR No</th>
                                <th>Sex</th>
                                <th>Token</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pat.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.mr_no}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.ticket_no}</td>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                className={cx(styles.serve, item.serving && styles.active)} 
                                                onClick={() => priotize(item.ticket_no, "serve", getRoom(currentUser.id))}
                                            >
                                                {item.serving ? "Serving" : "Serve"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {
                            pages !== 0 && <div className={styles.pagination}>
                                {
                                    Array.from({length: pages}).map((item:any,index:number)=> (
                                        <button onClick={()=> setPage(index+1)} className={cx(index+1===page && styles.active)}>{index+1}</button>
                                    ))
                                }
                            </div>
                        }
                    </table>
                    {pat.filter((item: any) => item.serving && item.serving_id === currentUser.phone).map((item: any, index: number) => (
                        <div
                            className={cx(
                                styles.serving,
                                pat.length > 0 && !fetchLoading && styles.active
                            )}
                            key={index}
                        >
                            <div className={cx(styles.spika, loading && styles.active)} onClick={() => setSpeaker(!isSpeaker)}>
                                <div 
                                    className={styles.rounder} 
                                    onClick={() => createItem(
                                        item.ticket_no.toString(), 
                                        "clinic", 
                                        "m02", 
                                        "http://localhost:5000/speaker/create_speaker", 
                                        getRoom(currentUser.id),
                                        currentUser.phone
                                    )}
                                >
                                    {loading ? <HiOutlineSpeakerXMark size={30} /> : <HiOutlineSpeakerWave size={30} />}
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.rowItem}>
                                    <button 
                                        className={styles.button} 
                                        onClick={() => editTicket(item.id, status === "pending" ? "waiting" : "pending")}
                                    >
                                        {status === "pending" ? "Unpend" : "Pend"}
                                    </button>
                                </div>
                                <div className={styles.rowItem}>
                                    <div className={styles.token}>{item.ticket_no}</div>
                                </div>
                                <div className={styles.rowItem}>
                                    <button className={styles.button} onClick={() => handleFinish(item.mr_no)}>
                                        Finish
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.message}>
                    {fetchLoading ? (
                        <div className={styles.wait}>
                            <Cubes />
                        </div>
                    ) : (
                        <div className={styles.wait}>
                            <h1>No Assigned Patients</h1>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}