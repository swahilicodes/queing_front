import React, { useEffect, useState } from 'react'
import styles from './services.module.scss'
import axios from 'axios'
import { MdDelete, MdOutlineClear } from 'react-icons/md'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { FiEdit2 } from 'react-icons/fi'
import useFetchData from '@/custom_hooks/fetch'

export default function Services() {
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
const {data} = useFetchData("https://qms-back.mloganzila.or.tz/clinic/get_clinics")
const [fields, setFields] = useState({
    service: "",
    clinic: "",
    namba: "",
    code: ""
})

useEffect(()=> {
    getServices()
},[page])

const clinicSeta = (code:string) => {
   const name =  data.find((coda: { clinicicode: string } )=> coda.clinicicode   === code)
   setFields({...fields,code:code,clinic: name.cliniciname})
}
 
 const submit  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("https://qms-back.mloganzila.or.tz/counters/create_counter",{service:fields.service,namba: fields.namba, clinic: fields.clinic,code: fields.code}).then((data:any)=> {
        setAdd(false)
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
 const deleteService  = (id:string) => {
    axios.put(`https://qms-back.mloganzila.or.tz/counters/delete_counter/${id}`).then(()=> {
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
 const editService  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.put(`https://qms-back.mloganzila.or.tz/counters/edit_counter/${id}`,{service:fields.service,namba: fields.namba, sub_service: fields.clinic}).then((data:any)=> {
        setEdit(false)
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
 const handlePageChange = (namba:number) => {
    setPage(namba);
  };
 const handleDelete = (namba:string) => {
    setId(namba);
    setDelete(true)
  };
 const handleEdit = (id:string, namba:string,name:string, clinic:string) => {
    setId(id);
    setEdit(true)
    setFields({...fields,service:name,namba:namba,clinic:clinic})
  };
 const getServices  = () => {
    setFetchLoading(true)
    axios.get("https://qms-back.mloganzila.or.tz/counters/get_counters",{params: {page,pagesize}}).then((data)=> {
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
                    <div className={styles.item}>
                        <label>Service</label>
                        <select onChange={e => setFields({...fields, service: e.target.value})} value={fields.service}>
                        <option value="" selected disabled>--Please choose an option--</option>
                            <option value="meds">Medical Records</option>
                            <option value="accounts">Cashier</option>
                            <option value="nurse_station">Nurse Station</option>
                        </select>
                    </div>
                    {
                        fields.service === "nurse_station" && (<div className={styles.item}>
                            <label>Sub-Service</label>
                            {/* <select onChange={e => setFields({...fields, clinic: e.target.value})} value={fields.clinic}> */}
                            <select onChange={e=> clinicSeta(e.target.value)} value={fields.code}>
                            <option value="" selected disabled>--Please choose an option--</option>
                                {
                                    data.map((data_: { clinicicode: string | number | readonly string[] | undefined; cliniciname: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined },index:number)=> (
                                        <option value={data_.clinicicode}>{data_.cliniciname}</option>
                                    ))
                                }
                            </select>
                        </div>)
                    }
                    <div className={styles.item}>
                    <label>Counter</label>
                    <input 
                    type="text" 
                    value={fields.namba}
                    onChange={e => setFields({...fields, namba: e.target.value})}
                    placeholder='number*'
                    />
                    </div>
                    <div className={styles.action}>
                    <button type='submit'>submit</button>
                    <div className={styles.clear} onClick={()=> setAdd(false)}><MdOutlineClear className={styles.icon}/></div>
                    </div>
                </form>
            </div> )
        }
        {
            isEdit && ( <div className={styles.add_service}>
                <form>
                <div className={styles.item}>
                        <label>Service</label>
                        <select onChange={e => setFields({...fields, service: e.target.value})} value={fields.service}>
                            <option value="" selected disabled>--Please choose an option--</option>
                            <option value="meds">Medical Records</option>
                            <option value="accounts">Accounts</option>
                            <option value="nurse_station">Clinic</option>
                        </select>
                    </div>
                    {
                        fields.service === "clinic" && (<div className={styles.item}>
                            <label>Sub-Service</label>
                            <select onChange={e => setFields({...fields, clinic: e.target.value})} value={fields.clinic}>
                            <option value="" selected disabled>--Please choose an option--</option>
                                {
                                    data.map((data_:Counter,index:number)=> (
                                        <option value={data_.name} key={index}>{data_.name}</option>
                                    ))
                                }
                            </select>
                        </div>)
                    }
                    <div className={styles.item}>
                    <label>Counter</label>
                    <input 
                    type="text" 
                    value={fields.namba}
                    onChange={e => setFields({...fields, namba: e.target.value})}
                    placeholder='number*'
                    />
                    </div>
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
                                    <th>Service</th>
                                    <th>Clinic</th>
                                    <th>Counter</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                services.map((data:Counter,index:number)=> (
                                    <tr key={index} className={cx(index%2===0 && styles.active)}>
                                        <td>{data.id}</td>
                                        <td>{data.service}</td>
                                        <td>{(data.clinic===null || data.clinic==="")?"N/A":data.clinic}</td>
                                        <td>{data.namba}</td>
                                        <td>
                                            <div className={styles.acta}>
                                            <div className={styles.delete} onClick={()=> handleDelete(data.id)}><MdDelete className={styles.icon}/></div> 
                                            <div className={styles.edit} onClick={()=> handleEdit(data.id,data.namba,data.name,data.subservice)}><FiEdit2 className={styles.icon}/></div> 
                                            </div>
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
                        : <div className={styles.message}>No Counters</div>
                    }
                </div>
            }
        </div>
    </div>
  )
}
