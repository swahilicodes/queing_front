import React, { useEffect, useState } from 'react'
import styles from './services.module.scss'
import axios from 'axios'
import { MdDelete, MdOutlineClear } from 'react-icons/md'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { FiEdit2 } from 'react-icons/fi'
import useFetchData from '@/custom_hooks/fetch'

export default function Attendants() {
const [isAdd, setAdd] = useState(false)
const [isDelete, setDelete] = useState(false)
const [, setEdit] = useState(false)
const [services, setServices] = useState([])
const [fetchLoading, setFetchLoading] = useState(false)
const router = useRouter()
const [page,setPage] = useState(1)
const [pagesize,setPageSize] = useState(10)
const [totalItems, setTotalItems] = useState(0);
const [id,setId] = useState("")
const {data:clinics,loading:srsLoading, error: srsError} = useFetchData("http://localhost:5000/clinic/get_clinics")
const [rooms, setRooms] = useState([])
const [fields, setFields] = useState({
    name: "",
    service: "",
    clinic: "",
    clinic_code: "188",
    phone: "",
    room: ""
})

useEffect(()=> {
    getAttendants()
    getRooms()
},[page,fields.clinic_code])
 
 const submit  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://localhost:5000/doktas/create_dokta",{name:fields.name,phone:fields.phone,room:fields.room,clinic: fields.clinic,clinic_code: fields.clinic_code}).then(()=> {
        setAdd(false)
        router.reload()
    }).catch((error)=> {
        console.log(error.response)
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            alert(error.message);
        }
    })
 }

 const handleClinic = (code:string) => {
    const coder = clinics.find((count:Counter) => count.clinicicode === code)
    setFields({...fields,clinic:coder.cliniciname,clinic_code: code,room: ""})
 }
 const deleteService  = (id:string) => {
    axios.put(`http://localhost:5000/doktas/delete_dokta/${id}`).then(()=> {
        router.reload()
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
 const getRooms  = () => {
    axios.get(`http://localhost:5000/rooms/get_rooms`,{params: {clinic_code: fields.clinic_code}}).then((data)=> {
        setRooms(data.data.data)
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
//  const editService  = (e:React.FormEvent) => {
//     e.preventDefault()
//     axios.put(`http://localhost:5000/doctors/edit_doctor/${id}`,{fields}).then(()=> {
//         setEdit(false)
//         router.reload()
//     }).catch((error:any)=> {
//         if (error.response && error.response.status === 400) {
//             console.log(`there is an error ${error.message}`)
//             alert(error.response.data.error);
//         } else {
//             console.log(`there is an error message ${error.message}`)
//             alert(error.message);
//         }
//     })
//  }
 const handlePageChange = (namba:number) => {
    setPage(namba);
  };
 const handleDelete = (namba:string) => {
    setId(namba);
    setDelete(true)
  };
 const handleEdit = (namba:string,doctor:Doctor) => {
    setId(namba);
    setEdit(true)
    setFields({
        ...fields,
        name: doctor.name,
        phone: doctor.phone,
        service: doctor.service,
        room: doctor.room
    })
  };
 const getAttendants  = () => {
    setFetchLoading(true)
    axios.get("http://localhost:5000/doktas/get_doktas",{params: {page,pagesize,clinic_code: fields.clinic_code}}).then((data)=> {
        setServices(data.data.data)
        setFetchLoading(false)
        setTotalItems(data.data.totalItems)
    }).catch((error)=> {
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

 function toCamelCase(str:string) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => 
            index === 0 ? match.toLowerCase() : match.toUpperCase()
        )
        .replace(/\s+/g, ''); // Remove spaces
}
  return (
    <div className={styles.services}>
        <div className={styles.service_top}>
            <div className={styles.service_left}>{router.pathname}</div>
            <div className={styles.service_right}>
            <div className={styles.change_clinic}>
                    <select onChange={e => setFields({...fields,clinic_code: e.target.value})}>
                        <option value="" selected disabled>Select Clinic</option>
                        {
                            clinics.map((item: { clinicicode: string | number | readonly string[] | undefined; cliniciname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined },index:number)=> (
                                <option value={item.clinicicode}>{item.cliniciname}</option>
                            ))
                        }
                    </select>
                </div>
                <div className={styles.add_new} onClick={()=> setAdd(!isAdd)}>
                 <p>Add new</p>
                </div>
            </div>
        </div>
        {
            isAdd && ( <div className={styles.add_service}>
                <form onSubmit={submit}>
                    <div className={styles.add_items}>
                    <div className={styles.add_item}>
                    <label htmlFor="name">Enter name:</label>
                    <input 
                    type="text" 
                    value={fields.name}
                    onChange={e => setFields({...fields,name:e.target.value})}
                    placeholder='name*'
                    id="name" 
                    name="name"
                    />
                    </div>
                    <div className={styles.add_item}>
                    <label htmlFor="phone">Enter phone:</label>
                    <input 
                    type="text" 
                    value={fields.phone}
                    onChange={e => setFields({...fields,phone:e.target.value})}
                    placeholder='phone*'
                    id="phone" 
                    name="phone"
                    />
                    </div>
                    <div className={styles.add_item}>
                    <label htmlFor="clinic">Select Clinic:</label>
                    <select
                    onChange={e => handleClinic(e.target.value)}
                    >
                        <option value="" selected disabled>Select Clinic</option>
                        {
                            clinics.map((item: { clinicicode: string | number | readonly string[] | undefined; cliniciname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined },index:number)=> (
                                <option value={item.clinicicode}>{item.cliniciname}</option>
                            ))
                        }
                    </select>
                    </div>
                    {
                        rooms.length>0 && (
                            <div className={styles.add_item}>
                            <label htmlFor="phone">Select Room:</label>
                            <select
                            onChange={e => setFields({...fields,room: e.target.value})}
                            >
                                <option value="" selected disabled>Select Clinic</option>
                                {
                                    rooms.map((item:Room,index:number)=> (
                                        <option value={item.namba} key={index}>{item.namba}</option>
                                    ))
                                }
                            </select>
                            </div>
                        )
                    }
                    <div className={styles.action}>
                    <button type='submit'>submit</button>
                    <div className={styles.clear} onClick={()=> setAdd(false)}><MdOutlineClear className={styles.icon}/></div>
                    </div>
                    </div>
                </form>
            </div> )
        }
        {
            isDelete && ( <div className={styles.add_service}>
                <form>
                    <h4>Are You Sure?</h4>
                    <div className={styles.action}>
                    <button onClick={()=> deleteService(id)}>Yes</button>
                    <div className={styles.clear} onClick={()=> setDelete(false)}><MdOutlineClear className={styles.icon}/></div>
                    </div>
                </form>
            </div> )
        }
        <div className={styles.service_list}>
            {
                fetchLoading
                ? <div className={styles.loader}>loading...</div>
                : <div className={styles.check}>
                {
                    services.length>0 
                    ? <div className={styles.services_list}>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Service</th>
                                <th>Room</th>
                                <th>Clinic</th>
                                <th>role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            services.map((item: Counter,index:number)=> (
                                <tr key={index} className={cx(index%2===0 && styles.active)}>
                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>{toCamelCase(item.service)}</td>
                                    <td>{item.room}</td>
                                    <td>{item.clinic===null?"N/A":item.clinic}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        <div className={styles.delete} onClick={()=> handleDelete(item.id)}><MdDelete className={styles.icon}/></div> 
                                        {/* <div className={styles.edit} onClick={()=> handleEdit(item.id,item)}><FiEdit2 className={styles.icon}/></div>  */}
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        {Array.from({ length: Math.ceil(totalItems / pagesize) }).map((_, index) => (
                        <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={cx(index+1===page && styles.active)}>
                            {index + 1}
                        </button>
                        ))}
            </div>
                </div> 
                    : <div className={styles.message}>No Attendants</div>
                }
            </div>
            }
        </div>
    </div>
  )
}
