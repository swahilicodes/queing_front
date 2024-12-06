import React, { useEffect, useState } from 'react'
import styles from './services.module.scss'
import axios from 'axios'
import { MdDelete, MdOutlineClear } from 'react-icons/md'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { FiEdit2 } from 'react-icons/fi'
import useFetchData from '@/custom_hooks/fetch'
import { RxEnterFullScreen } from 'react-icons/rx'

export default function Admins() {
const [name,setName] = useState("")
const [description,setDescription] = useState("")
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
const {data} = useFetchData("http://192.168.30.245:5000/services/get_all_services")
const [isFull,setFull] = useState(false)
const [desc,setDesc] = useState('')

useEffect(()=> {
    getAttendants()
    if(isFull){
        setInterval(()=> {
            setFull(false)
        },10000)
    }
},[page,data])
 
 const submit  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://192.168.30.245:5000/adverts/create_advert",{name,description}).then((data:any)=> {
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
    axios.put(`http://192.168.30.245:5000/adverts/delete_advert/${id}`).then(()=> {
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
    axios.put(`http://192.168.30.245:5000/services/edit_service/${id}`,{name}).then((data:any)=> {
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
 const handleEdit = (namba:string,name:string) => {
    setId(namba);
    setEdit(true)
    setName(name)
  };

 const showFull = (desc:string) => {
    setDesc(desc)
    setFull(true)
 }
 const getAttendants  = () => {
    setFetchLoading(true)
    axios.get("http://192.168.30.245:5000/adverts/get_adverts",{params: {page,pagesize}}).then((data)=> {
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
                    <label htmlFor="description">Enter Content:</label>
                    <input 
                    type="text" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder='content*'
                    id="phone" 
                    name="phone"
                    />
                    </div>
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
                                <th className={styles.name}>Name</th>
                                <th className={styles.name}>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            services.map((data:Advert,index:number)=> (
                                <tr key={index} className={cx(index%2===0 && styles.active)}>
                                    <td>{data.id}</td>
                                    <td className={styles.name}>{data.name}</td>
                                    <td className={styles.name}>{data.description}</td>
                                    <td>
                                        <div className={styles.delete} onClick={()=> handleDelete(data.id)}><MdDelete className={styles.icon}/></div> 
                                        <div className={styles.edit} onClick={()=> handleEdit(data.id,data.name)}><FiEdit2 className={styles.icon}/></div> 
                                        <div className={styles.expand} onClick={()=> showFull(data.description)}><RxEnterFullScreen className={styles.icon}/></div> 
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
                    : <div className={styles.message}>No Adverts </div>
                }
            </div>
            }
        </div>
         <div className={cx(styles.toast,isFull && styles.active)}>
            <p>{desc}</p>
            <div className={styles.clear} onClick={()=> setFull(false)}>
                <MdOutlineClear className={styles.icon}/>
            </div>
        </div>
    </div>
  )
}
