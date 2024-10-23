import React, { useEffect, useState } from 'react'
import styles from './services.module.scss'
import axios from 'axios'
import { MdDelete, MdOutlineClear } from 'react-icons/md'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { FiEdit2 } from 'react-icons/fi'
import useFetchData from '@/custom_hooks/fetch'

export default function Admins() {
const [name,setName] = useState("")
const [phone,setPhone] = useState("")
const [service,setService] = useState("")
const [counter,setCounter] = useState("")
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
const {data,loading:srsLoading, error: srsError} = useFetchData("http://localhost:5000/services/get_all_services")
const {data:counters,loading:cLoading, error: cError} = useFetchData("http://localhost:5000/counters/get_all_counters")

useEffect(()=> {
    getAttendants()
},[page,data])
 
 const submit  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://localhost:5000/admins/create_admin",{name,phone,service:"administration",counter:"101",role:"admin"}).then((data:any)=> {
        setAdd(false)
        router.reload()
    }).catch((error:any)=> {
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            alert(error.message);
        }
    })
 }
 const deleteService  = (id:any) => {
    axios.put(`http://localhost:5000/admins/delete_admin/${id}`).then((data:any)=> {
        router.reload()
    }).catch((error:any)=> {
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            alert(error.message);
        }
    })
 }
 const editService  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.put(`http://localhost:5000/services/edit_service/${id}`,{name}).then((data:any)=> {
        setEdit(false)
        router.reload()
    }).catch((error:any)=> {
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            alert(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            alert(error.message);
        }
    })
 }
 const handlePageChange = (namba:number) => {
    setPage(namba);
  };
 const handleDelete = (namba:any) => {
    setId(namba);
    setDelete(true)
  };
 const handleEdit = (namba:string,name:string) => {
    setId(namba);
    setEdit(true)
    setName(name)
  };
 const getAttendants  = () => {
    setFetchLoading(true)
    axios.get("http://localhost:5000/admins/get_admins",{params: {page,pagesize}}).then((data:any)=> {
        setServices(data.data.data)
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
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder='name*'
                    id="name" 
                    name="name"
                    />
                    </div>
                    <div className={styles.add_item}>
                    <label htmlFor="phone">Enter phone:</label>
                    <input 
                    type="text" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder='phone*'
                    id="phone" 
                    name="phone"
                    />
                    </div>
                    {/* <div className={styles.add_item}>
                    <label htmlFor="service">Select service:</label>
                    <select value={service}
                    onChange={e => setService(e.target.value)}>
                        <option selected disabled defaultValue="Select Service">Select Service</option>
                        {
                            data.map((item:any,index:number)=> (
                                <option value={item.name} key={index}>{item.name}</option>
                            ))
                        }
                    </select>
                    </div> */}
                    {/* <div className={styles.add_item}>
                    <label htmlFor="counter">Select counter:</label>
                    <select value={counter}
                    onChange={e => setCounter(e.target.value)}>
                        <option selected disabled>Select Counter</option>
                        {
                            counters.map((item:any,index:number)=> (
                                <option value={item.name} key={index}>{item.name}</option>
                            ))
                        }
                    </select>
                    </div> */}
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
                <form>
                    <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder='name*'
                    />
                    <div className={styles.action}>
                    <button onClick={editService}>submit</button>
                    <div className={styles.clear} onClick={()=> setEdit(false)}><MdOutlineClear className={styles.icon}/></div>
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
                                <th>Id</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            services.map((data:any,index:number)=> (
                                <tr key={index} className={cx(index%2===0 && styles.active)}>
                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.role}</td>
                                    <td>{data.phone}</td>
                                    <td>
                                        <div className={styles.delete} onClick={()=> handleDelete(data.id)}><MdDelete className={styles.icon}/></div> 
                                        <div className={styles.edit} onClick={()=> handleEdit(data.id,data.name)}><FiEdit2 className={styles.icon}/></div> 
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
                    : <div className={styles.message}>No Admins</div>
                }
            </div>
            }
        </div>
    </div>
  )
}
