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
const {data} = useFetchData("http://localhost:5000/services/get_all_services")
const [isFull,setFull] = useState(false)
const [desc,setDesc] = useState('')
const [pages, setPages] = useState([])
const [fields, setFields] = useState({
    page: ""
})

useEffect(()=> {
    getAttendants()
    getPages()
    if(isFull){
        setInterval(()=> {
            setFull(false)
        },10000)
    }
},[page,data])
 
 const submit  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://localhost:5000/adverts/create_advert",{name,description}).then((data:any)=> {
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

 const editService  = (e:React.FormEvent) => {
    e.preventDefault()
    axios.get(`http://localhost:5000/network/edit_device`,{params: {page: fields.page, id: id}}).then(()=> {
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
 const deleteService  = () => {
    axios.get(`http://localhost:5000/network/delete_device`,{params: {id: id}}).then(()=> {
        setDelete(false)
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
  };

  const getPages = () => {
    axios.get("http://localhost:3000/api/getPages").then((data)=> {
      const pags = data.data.pages.map((page: string)=> getFirstPathSegment(page))
      setPages(pags)
    }).catch((error)=> {
      console.log(error)
    })
  }
  function getFirstPathSegment(path: string): string {
    const cleanedPath = path.replace(/\/[^\/]+$/, '');
    const segments = cleanedPath.split('/').filter(Boolean);
    return `/${segments[0] || ''}`;
  }
 const getAttendants  = () => {
    setFetchLoading(true)
    axios.get("http://localhost:5000/network/get_devices",{params: {page,pagesize}}).then((data)=> {
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
                <p>{totalItems}</p>
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
                    <label>Choose Page</label>
                    <select
                    value={fields.page}
                    onChange={e => setFields({...fields,page: e.target.value})}
                    >
                        <option value="" selected disabled>Select Page</option>
                        {
                            pages.map((item,index)=> (
                                <option value={item} key={index}>{item}</option>
                            ))
                        }
                    </select>
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
                    <div onClick={()=> deleteService()} className={styles.button}>Yes</div>
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
                                <th className={styles.name}>Mac</th>
                                <th className={styles.name}>Name</th>
                                <th className={styles.name}>Model</th>
                                <th className={styles.name}>Manufucturer</th>
                                <th className={styles.name}>Page</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            services.map((data:any,index:number)=> (
                                <tr key={index} className={cx(index%2===0 && styles.active)}>
                                    <td>{data.id}</td>
                                    <td className={styles.name}>{data.macAddress}</td>
                                    <td className={styles.name}>{data.deviceName}</td>
                                    <td className={styles.name}>{data.deviceModel}</td>
                                    <td className={styles.name}>{data.manufucturer}</td>
                                    <td className={styles.name}>{data.default_page===null?"N/A":data.default_page}</td>
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
                    : <div className={styles.message}>No Devices </div>
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
