import React, { useEffect, useState } from 'react'
import styles from './services.module.scss'
import axios from 'axios'
import { MdDelete, MdOutlineClear } from 'react-icons/md'
import { useRouter } from 'next/router'
import cx from 'classnames'
import useFetchData from '@/custom_hooks/fetch'
import { useSetRecoilState } from 'recoil'
import messageState from '@/store/atoms/message'

export default function Attendants() {
const [isAdd, setAdd] = useState(false)
const [isDelete, setDelete] = useState(false)
const [isEdit, setEdit] = useState(false)
const [services, setServices] = useState([])
const [fetchLoading, setFetchLoading] = useState(false)
const router = useRouter()
const [page,setPage] = useState(1)
const [pagesize,setPageSize] = useState(10)
const [totalItems, setTotalItems] = useState(0);
const [id,setId] = useState("")
const setMessage = useSetRecoilState(messageState)
const {data} = useFetchData("http://localhost:5000/services/get_all_services")
const {data:counters} = useFetchData("http://localhost:5000/counters/get_all_counters")
const [fields, setFields] = useState({
    name: "",
    role: "",
    service: "",
    counter: "",
    clinic: "",
    clinic_code: "",
    phone: ""
})

useEffect(()=> {
    getAttendants()
},[page,data])
 
 const submit  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://localhost:5000/doctors/create_doctor",{name:fields.name,phone:fields.phone,service:fields.service,room:fields.counter,clinic: fields.clinic,clinic_code: fields.clinic_code}).then((data:any)=> {
        setAdd(false)
        router.reload()
    }).catch((error)=> {
        if (error.response && error.response.status === 400) {
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
        } else {
            setMessage({...onmessage,title:error.message,category: "error"})
        }
    })
 }

 const handleCounter = (name:string) => {
    const code = counters.find((count:Counter) => count.clinic === name)
    setFields({...fields,clinic:name,clinic_code: code.code})
    console.log(name,code.code)
 }
 const deleteService  = (id:string) => {
    axios.put(`http://localhost:5000/doctors/delete_doctor/${id}`).then(()=> {
        router.reload()
    }).catch((error)=> {
        if (error.response && error.response.status === 400) {
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
        } else {
            setMessage({...onmessage,title:error.message,category: "error"})
        }
    })
 }
 const editService  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.put(`http://localhost:5000/doctors/edit_doctor/${id}`,{fields}).then((data:any)=> {
        setEdit(false)
        router.reload()
    }).catch((error)=> {
        if (error.response && error.response.status === 400) {
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
        } else {
            setMessage({...onmessage,title:error.message,category: "error"})
        }
    })
 }
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
        counter: doctor.room
    })
  };
 const getAttendants  = () => {
    setFetchLoading(true)
    axios.get("http://localhost:5000/doctors/get_doctors",{params: {page,pagesize}}).then((data)=> {
        setServices(data.data.data)
        setFetchLoading(false)
        setTotalItems(data.data.totalItems)
    }).catch((error)=> {
        setFetchLoading(false)
        if (error.response && error.response.status === 400) {
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
        } else {
            setMessage({...onmessage,title:error.message,category: "error"})
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
            <div className={styles.service_right} onClick={()=> setAdd(!isAdd)}>
                <p>Add new</p>
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
                    <label htmlFor="service">Select service:</label>
                    <select value={fields.service}
                    onChange={e => setFields({...fields,service:e.target.value})}>
                        <option selected disabled defaultValue="Select Service">Select Service</option>
                        {
                            Array.from(new Set(counters.map((item:Counter) => item.service))).map(name => counters.find((item:Counter) => item.service === name)).map((data01,index)=> (
                                <option value={data01.service} key={index}>{data01.service}</option>
                            ))
                        }
                    </select>
                    </div>
                    {
                        fields.service === "nurse_station" && (<div className={styles.add_item}>
                            <label htmlFor="counter">Select Clinic:</label>
                            <select value={fields.clinic}
                            // onChange={e => setFields({...fields,clinic: e.target.value})}>
                            onChange={e => handleCounter(e.target.value)}>
                                <option selected disabled>Select Clinic</option>
                                {
                                    Array.from(new Set(counters.map((item:Counter) => item.clinic))).map(name => counters.find((item:Counter) => item.clinic === name)).map((data01,index)=> (
                                        <option value={data01.clinic} key={index}>{data01.clinic}</option>
                                    ))
                                }
                                {/* {
                                    counters.filter((data:any)=> data.subservice !== null).map((item:any,index:number)=> (
                                        <option value={item.subservice} key={index}>{item.subservice}</option>
                                    ))
                                } */}
                            </select>
                            </div>)
                    }
                    {
                        (fields.service === "nurse_station" && fields.clinic !== '') && (<div className={styles.add_item}>
                            <label htmlFor="counter">Select Counter:</label>
                            <select value={fields.counter}
                            onChange={e => setFields({...fields,counter: e.target.value})}>
                                <option selected>Select Counter</option>
                                {
                                    counters.filter((data:Counter)=> data.clinic === fields.clinic).map((item:Counter,index:number)=> (
                                        <option value={item.namba} key={index}>{item.namba}</option>
                                    ))
                                }
                            </select>
                            </div>)
                    }
                    {
                        (fields.service !== "" && fields.service !== "nurse_station") && (<div className={styles.add_item}>
                            <label htmlFor="counter">Select counter:</label>
                            <select value={fields.counter}
                            onChange={e => setFields({...fields,counter: e.target.value})}>
                                <option selected disabled>Select Counter</option>
                                {
                                    fields.service !== "nurse_station" && (<option selected value={counters[0].namba}>Select Counter</option>)
                                }
                                {
                                    counters.filter((data:Counter)=> data.service === fields.service).map((item:Counter,index:number)=> (
                                        <option value={item.namba} key={index}>{item.namba}</option>
                                    ))
                                }
                            </select>
                            </div>)
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
            isEdit && ( <div className={styles.add_service}>
                <form onSubmit={submit}>
                    <div className={styles.add_items}>
                    <div className={styles.add_item}>
                    <label htmlFor="name">Enter name:</label>
                    <input 
                    type="text" 
                    value={fields.name}
                    onChange={e => setFields({...fields,name: e.target.value})}
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
                    onChange={e => setFields({...fields,phone: e.target.value})}
                    placeholder='phone*'
                    id="phone" 
                    name="phone"
                    />
                    </div>
                    <div className={styles.add_item}>
                    <label htmlFor="service">Select service:</label>
                    <select value={fields.service}
                    onChange={e => setFields({...fields,service:e.target.value})}>
                        <option selected disabled defaultValue="Select Service">Select Service</option>
                        {
                            Array.from(new Set(counters.map((item:Counter) => item.name))).map(name => counters.find((item:Counter) => item.name === name)).map((data01:Counter,index)=> (
                                <option value={data01.name} key={index}>{data01.name}</option>
                            ))
                        }
                    </select>
                    </div>
                    {
                        fields.service !== "" && (<div className={styles.add_item}>
                            <label htmlFor="counter">Select counter:</label>
                            <select value={fields.counter}
                            onChange={e => setFields({...fields,counter: e.target.value })}>
                                <option selected disabled>Select Counter</option>
                                {
                                    counters.filter((data:Counter)=> data.name === fields.service).map((item:Counter,index:number)=> (
                                        <option value={item.namba} key={index}>{item.namba}</option>
                                    ))
                                }
                            </select>
                            </div>)
                    }
                    <div className={styles.action}>
                    <button onClick={editService}>submit</button>
                    <div className={styles.clear} onClick={()=> setEdit(false)}><MdOutlineClear className={styles.icon}/></div>
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
                                <th>Counter</th>
                                <th>Clinic</th>
                                <th>role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            services.map((item:Counter,index:number)=> (
                                <tr key={index} className={cx(index%2===0 && styles.active)}>
                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>{toCamelCase(item.service)}</td>
                                    <td>{item.counter}</td>
                                    <td>{item.clinic===null?"N/A":item.clinic}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        <div className={styles.delete} onClick={()=> handleDelete(item.id)}><MdDelete className={styles.icon}/></div> 
                                        {/* <div className={styles.edit} onClick={()=> handleEdit(item.id,item)}><FiEdit2 className={styles.icon}/></div>  */}
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
