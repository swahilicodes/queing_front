import React, { useEffect, useState } from 'react'
import styles from './settings.module.scss'
import { useRouter } from 'next/router'
import { BsFeather } from 'react-icons/bs'
import { MdOutlineClear } from 'react-icons/md'
import { IoSettingsOutline } from 'react-icons/io5'
import useFetchData from '@/custom_hooks/fetch'
import axios from 'axios'
import { useSetRecoilState } from 'recoil'
import messageState from '@/store/atoms/message'

export default function Settings() {
//  const pages = ["/","/attendants","/counters","/dashboard","/login","/queue_list","/services","/settings","/queue_add"]
 const {data:clinics,loading} = useFetchData("http://192.168.30.246:5000/clinic/get_clinics")
 const [page,setPage] = useState('')
 const [clinic,setClinic] = useState('')
 const [defaultPage, setDefaultPage] = useState('')
 const [defaultClinic, setDefaultClinic] = useState('')
 const router = useRouter()
 const [isAddDefaultPage, setAddDefaultPage] = useState(false)
 const [isAddDefaultClinic, setAddDefaultClinic] = useState(false)
 const [pages, setPages] = useState([])
 const setMessage = useSetRecoilState(messageState)

 useEffect(()=> {
    retrievePage(),
    retrieveClinic()
    getPages()
 },[clinics])

 const retrievePage = () => {
    const saved = localStorage.getItem('page')
    if(saved) {
        setDefaultPage(saved)
    }else{
        setDefaultPage("index")
    }
 }
 const retrieveClinic = () => {
    const saved = localStorage.getItem('clinic')
    if(saved) {
        setDefaultClinic(saved)
    }else{
        setDefaultClinic("index")
    }
 }

 const changePage = (e:React.FormEvent) => {
    e.preventDefault()
    const saved = localStorage.getItem('page')
    if(!page){
        setMessage({...onmessage,title:"page is required",category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
    }else{
        if(saved){
            localStorage.removeItem('page')
            localStorage.setItem('page',page)
            router.reload()
        }else{
            localStorage.setItem('page',page)
            router.reload()
        }
    }
 }
 const changeClinic = (e:React.FormEvent) => {
    e.preventDefault()
    const saved = localStorage.getItem('clinic')
    if(!clinic){
        setMessage({...onmessage,title:"clinic is required",category: "error"})
          setTimeout(()=> {
            setMessage({...onmessage,title:"",category: ""})
          },3000)
    }else{
        if(saved){
            localStorage.removeItem('clinic')
            localStorage.setItem('clinic',clinic)
            router.reload()
        }else{
            localStorage.setItem('clinic',clinic)
            router.reload()
        }
    }
 }

 const getPages = () => {
    axios.get("http://192.168.30.246:3000/api/getPages").then((data)=> {
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
  return (
    <div className={styles.settings_}>
        <div className={styles.top}>
            <div className={styles.left}>{router.pathname}</div>
            <div className={styles.right}><IoSettingsOutline className={styles.icon} size={30}/></div>
        </div>
        {
            isAddDefaultPage && ( <div className={styles.overlay}><form onSubmit={changePage}>
                <div className={styles.add_item}>
                    <label htmlFor="service">Select Page:</label>
                    <select value={page}
                    onChange={e => setPage(e.target.value)}>
                        <option selected disabled defaultValue="Select Service">Select Service</option>
                        {
                            pages.map((item,index:number)=> (
                                <option value={item} key={index}>{item}</option>
                            ))
                        }
                    </select>
                    </div>
                    <div className={styles.action}>
                    <button type='submit'>submit</button>
                    <div className={styles.clear} onClick={()=> setAddDefaultPage(false)}><MdOutlineClear className={styles.icon}/></div>
                    </div>
            </form></div> )
        }
        {
            isAddDefaultClinic && ( <div className={styles.overlay}><form onSubmit={changeClinic}>
                <div className={styles.add_item}>
                    <label htmlFor="service">Select Clinic:</label>
                    <select value={clinic}
                    onChange={e => setClinic(e.target.value)}>
                        <option selected disabled defaultValue="Select Service">Select Clinic</option>
                        {
                            clinics.map((item: Counter,index:number)=> (
                                <option value={item.clinicicode} key={index}>{item.cliniciname}-{item.clinicicode}</option>
                            ))
                        }
                    </select>
                    </div>
                    <div className={styles.action}>
                    <button type='submit'>submit</button>
                    <div className={styles.clear} onClick={()=> setAddDefaultClinic(false)}><MdOutlineClear className={styles.icon}/></div>
                    </div>
            </form></div> )
        }
        <div className={styles.wrap}>
            <div className={styles.setting}>
                <div className={styles.set_left}>
                    <h4>Default Page</h4>
                    <h5>{defaultPage}</h5>
                </div>
                <div className={styles.set_right} onClick={()=> setAddDefaultPage(true)}>
                    <BsFeather className={styles.icon}/>
                </div>
            </div>
            <div className={styles.setting}>
                <div className={styles.set_left}>
                    <h4>Default Clinic</h4>
                    <h5>{defaultClinic}</h5>
                </div>
                <div className={styles.set_right} onClick={()=> setAddDefaultClinic(true)}>
                    <BsFeather className={styles.icon}/>
                </div>
            </div>
        </div>
    </div>
  )
}
