import React, { useState } from 'react'
import styles from './login_modal.module.scss'
import axios from 'axios'
import { useSetRecoilState } from 'recoil'
import isFull from '@/store/atoms/isFull'
import cx from 'classnames'
import { useRouter } from 'next/router'

function LoginModal() {
 const setFull = useSetRecoilState(isFull)
 const router = useRouter()
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
    axios.post("https://qms-back.mloganzila.or.tz/users/login",{phone: fields.phone,password:fields.password},{headers}).then((data)=> {
        localStorage.setItem("token",data.data)
        setTimeout(()=> {
            setLoading(false)
            setFull(false)
            router.reload()
        },4000)
    }).catch((error)=> {
            setLoading(false)
        setFull(false)
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            //setError(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            //setError(error.message);
        }
    })
 }
  return (
    <div className={styles.login_modal}>
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
            <button type='submit'>Sign In</button>
            <div className={cx(styles.loader,loading && styles.active)}>
            <div className={styles.inside}></div>
            </div>
        </form>
    </div>
  )
}

export default LoginModal