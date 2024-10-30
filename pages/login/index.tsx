import React, { useEffect, useState } from 'react'
import styles from './login.module.scss'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useRecoilState, useRecoilValue } from 'recoil'
import errorState from '@/store/atoms/error'
import currentUserState from '@/store/atoms/currentUser'

export default function Login() {
 const [phone, setPhone] = useState('')
 const [pass, setPass] = useState('')
 const router = useRouter()
 const [,setError] = useRecoilState(errorState)
 const currentUser:any = useRecoilValue(currentUserState)
 const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer `  // Example header for authorization
};

 useEffect(()=> {
  if(currentUser  && currentUser.name !== undefined){
    router.push('/')
  }
 })

 const login = (e:React.FormEvent) => {
    e.preventDefault()
    axios.post("http://localhost:5000/users/login",{phone,password:pass},{headers}).then((data)=> {
        localStorage.setItem("token",data.data)
        router.push("/")
        router.reload()
    }).catch((error)=> {
        if (error.response && error.response.status === 400) {
            console.log(`there is an error ${error.message}`)
            setError(error.response.data.error);
        } else {
            console.log(`there is an error message ${error.message}`)
            setError(error.message);
        }
    })
 }
  return (
    <div className={styles.login}>
      <div className={styles.top}>
        <div className={styles.left}>
          <img src="/tz.png" alt="" />
        </div>
        <div className={styles.title}>
          <h1>JAMHURI YA MUUNGANO WA TANZANIA</h1>
          <h3>HOSPITALI YA TAIFA MUHIMBILI-MLOGANZILA</h3>
        </div>
        <div className={styles.left}>
          <img src="/mnh.png" alt="" />
        </div>
      </div>
        <form className={styles.form} onSubmit={login}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.input}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className={styles.input}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  )
}
