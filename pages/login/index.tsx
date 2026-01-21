import React, { useState } from 'react'
import styles from './login.module.scss'
import axios from 'axios'
import { useSetRecoilState } from 'recoil'
import isFull from '@/store/atoms/isFull'
import cx from 'classnames'
import { useRouter } from 'next/router'
import messageState from '@/store/atoms/message'
import Cubes from '@/components/loaders/cubes/cubes'

function Login() {
 const setFull = useSetRecoilState(isFull)
 const router = useRouter()
 const setMessage = useSetRecoilState(messageState)
 const [fields, setFields] = useState({
    phone: "",
    password: ""
 })
 const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer `  // Example header for authorization
  };
  const [loading, setLoading] = useState(false)

 const login = (e:React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    axios.post("http://192.168.30.246:5005/users/login",{phone: fields.phone,password:fields.password},{headers}).then((data)=> {
        localStorage.setItem("token",data.data)
        setFields({...fields,phone:"",password:""})
        setTimeout(()=> {
            setLoading(false)
            setFull(false)
            router.reload()
        },4000)
    }).catch((error)=> {
        setFull(false)
        setLoading(false)
        if (error.response && error.response.status === 400) {
            setMessage({...onmessage,title:error.response.data.error,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        } else {
            setMessage({...onmessage,title:error.message,category: "error"})
            setTimeout(()=> {
                setMessage({...onmessage,title:"",category: ""})  
            },5000)
        }
    })
 }
  return (
    <div className={styles.login}>
        <div className={styles.login_topa}>
            <div className={styles.left}>
                <img src="/tz.png" alt="" />
            </div>
            <div className={styles.center}>
                <h2>THE UNITED REPUBLIC OF TANZANIA</h2>
                <h1>Muhimbili National Hospital - Mloganzila</h1>
            </div>
            <div className={styles.right}>
            <img src="/mnh.png" alt="" />
            </div>
        </div>
        <form onSubmit={login}>
            <div className={styles.logo}>
                <img src="/mnh.png" alt="" />
            </div>
            <div className={styles.item}>
                <label>Phone</label>
                <input 
                type="text" 
                placeholder='Enter Phone'
                value={fields.phone}
                onChange={e => setFields({...fields,phone: e.target.value})}
                />
            </div>
            <div className={styles.item}>
                <label>Password</label>
                <input 
                type="password" 
                placeholder='Enter Password'
                value={fields.password}
                onChange={e => setFields({...fields,password: e.target.value})}
                />
            </div>
            <button type='submit' disabled={loading}>{loading?"Loading..":"Sign In"}</button>
            <div className={cx(styles.loader,loading && styles.active)}>
            <div className={styles.inside}></div>
            </div>
        </form>
        <div className={styles.login_bottom}>
            <p>Quieing Management System <span>V1.0.0</span></p>
        </div>
    </div>
  )
}

export default Login