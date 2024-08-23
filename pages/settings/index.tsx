import React, { useEffect, useState } from 'react'
import styles from './settings.module.scss'
import { useRouter } from 'next/router'
import { BsFeather } from 'react-icons/bs'
import { MdOutlineClear } from 'react-icons/md'
import { IoSettingsOutline } from 'react-icons/io5'

export default function Settings() {
 const pages = ["/","/attendants","/counters","/dashboard","/login","/queue_list","/services","/settings","/queue_add"]
 const [page,setPage] = useState('')
 const [defaultPage, setDefaultPage] = useState('')
 const router = useRouter()
 const [isAddDefaultPage, setAddDefaultPage] = useState(false)

 useEffect(()=> {
    const saved = localStorage.getItem('page')
    if(saved) {
        setDefaultPage(saved)
    }else{
        setDefaultPage("index")
    }
 })

 const changePage = (e:React.FormEvent) => {
    e.preventDefault()
    const saved = localStorage.getItem('page')
    if(!page){
        alert("page is required")
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
  return (
    <div className={styles.settings}>
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
                            pages.map((item:any,index:number)=> (
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
        </div>
    </div>
  )
}
